import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import express from 'express';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { fileURLToPath } from 'url';
import { fileTypeFromBuffer } from 'file-type';
import openai from 'openai';
import axios from 'axios';


openai.apiKey = "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";
tf.setBackend('tensorflow');

// Load in trained NN model
async function loadModel() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const modelPath = path.resolve(__dirname+"\\DR_Detection_3.json", 'model.json');
  const model = await tf.loadLayersModel(`file://${modelPath}`, {
    weightsPathPrefix: path.dirname(modelPath),
  });
  return model;
}

async function preprocessImage(imageBuffer) {
  return new Promise(async (resolve) => {
    try {
      // Detect the image type from the buffer
      const imgType = await fileTypeFromBuffer(imageBuffer);
      const imgExt = imgType ? imgType.ext : 'jpeg';

      // Convert the buffer to a base64 string
      const base64Image = `data:image/${imgExt};base64,${imageBuffer.toString('base64')}`;

      // Resize the image to (224, 224) and convert it to JPEG format
      const resizedImageBuffer = await sharp(Buffer.from(base64Image.split(',')[1], 'base64'))
        .resize(224, 224)
        .jpeg()
        .toBuffer();

      resolve(resizedImageBuffer);
    } catch (error) {
      console.error('Error during image processing:', error);
    }
  });
}

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function formatOutput(prediction) {
  const predictionArray = prediction.dataSync();
  const indexOfMaxValue = predictionArray.indexOf(Math.max(...predictionArray));
  console.log(predictionArray);
  let prompt;
  let pred;

  if(indexOfMaxValue == 2) {
    pred = "No Diabetic Retinopathy"
    prompt = 'Pretend that you are an eye doctor and explain to your patient that their retinal images show no sign of Diabetic Retinopathy';
  }
  else if(indexOfMaxValue == 0) {
    pred = "Mild Diabetic Retinopathy"
    prompt = 'Pretend that you are an eye doctor and explain to your patient that their retinal images indicate that they have a mild case of Diabetic Retinopathy';
  }
  else if(indexOfMaxValue == 1) {
    pred = "Moderate Diabetic Retinopathy"
    prompt = 'Pretend that you are an eye doctor and explain to your patient that their retinal images indicate that they have a moderate case of Diabetic Retinopathy';
  }
  else if(indexOfMaxValue == 4) {
    pred = "Severe Diabetic Retinopathy"
    prompt = 'Pretend that you are an eye doctor and explain to your patient that their retinal images indicate that they have a severe case of Diabetic Retinopathy';
  }
  else if(indexOfMaxValue == 3) {
    pred = "Proliferate Diabetic Retinopathy"
    prompt = 'Pretend that you are an eye doctor and explain to your patient that their retinal images indicate that they have a proliferate case of Diabetic Retinopathy';
  }

  const response = await fetchCompletion(prompt);

  return `${pred}<br><br>${'AI Doctor: '}${response.choices[0].text.trim()}`;
}

async function fetchCompletion(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data from OpenAI API:", error);
  }
}

// GraphQL Schema
const typeDefs = gql`
  scalar Upload

  type Query {
    hello: String
    getCompletion(prompt: String!): String
  }

  type File {
    filename: String!
    mimetype: String!
    path: String!
  }

  type UploadResult {
    success: Boolean!
    message: String!
    file: File
  }

  type Mutation {
    uploadImage(file: Upload!): UploadResult!
    predictImage(file: Upload!): PredictionResult
  }

  type PredictionResult {
    output: String
  }
`;

// Root resolver
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getCompletion: async (_source, { prompt }) => {
      try {
        const response = await formatOutput({ dataSync: () => [prompt] });
        return response;
      } catch (error) {
        console.error("Error fetching completion:", error);
      }
    },
  },

  Mutation: {
    predictImage: async (_, { file }) => {
      try {
        // Handle the file upload
        const { createReadStream } = await file;
        const stream = createReadStream();

        // Load the trained NN model
        const model = await loadModel();
        console.log('model is loaded');

        // Preprocess the uploaded image
        const preprocessedImage = await preprocessImage(await streamToBuffer(stream));
        console.log('image is preprocessed');

        // Convert the preprocessed image to a tensor
        const imageTensor = tf.node.decodeImage(preprocessedImage, 3);
        const imageBatch = imageTensor.expandDims(0);

        console.log('image is decoded');

        // Run the prediction and return the output
        const prediction = model.predict(imageBatch);
        console.log('prediction is made');

        // Output the prediction
        const output = formatOutput(prediction);
        console.log('output about to be sent to UI');

        return { output };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};

const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  context: ({ req, res }) => ({ req, res }),
  uploads: { maxFileSize: 10000000, maxFiles: 10, timeout: 30000 },
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const app = express();

server.start().then(() => {
  app.use(cors({ origin: 'http://localhost:3000' }));
  app.use(express.static('public'));

  app.post('/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  server.applyMiddleware({ app });

  app.listen(3001, function() {
    console.log('App started on port 3001');
  });
});