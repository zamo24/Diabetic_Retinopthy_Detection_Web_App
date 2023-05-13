
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Button, Accordion, AccordionSummary, 
        AccordionDetails, CircularProgress, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useMutation } from '@apollo/client';


class AppHeader extends React.Component {
    render() {
        return (
            <div>
                <Typography variant='h2' align='center'>Diabetic Retinopathy Detector</Typography>
            </div>
        );
    }
}

class IngestImage extends React.Component {
  render() {
    const UPLOAD_IMAGE = gql`
      mutation PredictImage($file: Upload!) {
        predictImage(file: $file) {
          output
        }
      }
    `;

    function UploadButton() {
      const [selectedFile, setSelectedFile] = useState(null);
      const [prediction, setPrediction] = useState(null);
      const [loading, setLoading] = useState(false);
      const [isCollapsed, setIsCollapsed] = useState(true);

      const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
      };

      const [predictImageMutation] = useMutation(UPLOAD_IMAGE);

      const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        console.log("Selected file:", selectedFile);

        try {
          const { data } = await predictImageMutation({
            variables: { file: selectedFile },
          });

          console.log(data);
          setPrediction(data.predictImage.output);
        } catch (error) {
          console.error('Error details:', error);
          console.error('Error response:', error.networkError?.result);
        }
        setLoading(false);
        setIsCollapsed(false);
      };

      return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            style={{ display: "none" }}
            onChange={handleFileSelect}
            name="file"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !selectedFile}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
          <Collapse in={!isCollapsed}>
            {prediction && (
              <>
                <hr />
                <Typography variant='subtitle1'>
                  Prediction:{' '}
                  <span dangerouslySetInnerHTML={{ __html: prediction }}></span>
                </Typography>
              </>
            )}
          </Collapse>
        </form>
      );
    }

    const uploadLink = createUploadLink({
      uri: 'http://localhost:3001/graphql',
    });

    const client = new ApolloClient({
      link: uploadLink,
      cache: new InMemoryCache(),
    });

    return (
      <React.Fragment>
        <ApolloProvider client={client}>
          <Typography variant="h6">Upload a retinal image of the eye:</Typography>
          <UploadButton />
        </ApolloProvider>
      </React.Fragment>
    );
  }
}

class PageContent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <AppHeader />
                <hr/>
                <IngestImage />
                <hr/>
                <DiabeticRetinopathyInformation />
            </React.Fragment>
        );
    }
}

class DiabeticRetinopathyInformation extends React.Component {
    render() {
        function SimpleAccordion() {
            return (
              <div>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>More Info on Diabetic Retinopathy</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <hr color='gray'/>
                    <Typography>
                      Diabetic retinopathy is a complication of diabetes that affects the blood vessels in the retina, 
                      the light-sensitive tissue located at the back of the eye. The retina is responsible for converting 
                      light into electrical signals that are sent to the brain, enabling us to see.<br /><br />

                      Diabetic retinopathy occurs when high blood sugar levels damage the tiny blood vessels in the retina, 
                      causing them to leak or swell, or even close off completely. In some cases, abnormal new blood vessels 
                      can grow on the surface of the retina. These changes can lead to vision loss, and if left untreated, 
                      may result in blindness.<br /><br />

                      There are two main stages of diabetic retinopathy:<br /><br />

                      1. Non-proliferative diabetic retinopathy (NPDR): This is the early stage, characterized by weakened blood 
                      vessels in the retina that may leak blood or fluid. This can cause the retina to swell or form deposits 
                      called hard exudates. NPDR can be further divided into mild, moderate, and severe, depending on the extent 
                      of the damage.<br /><br />

                      2. Proliferative diabetic retinopathy (PDR): This is the more advanced stage, marked by the growth of abnormal 
                      new blood vessels on the surface of the retina. These vessels are fragile and prone to bleeding, which can 
                      lead to the formation of scar tissue and, in severe cases, retinal detachment. PDR can also cause a condition 
                      called neovascular glaucoma, where the new blood vessels interfere with the normal flow of fluid in the eye, 
                      leading to increased eye pressure and damage to the optic nerve.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            );
        }
        return (
            <React.Fragment>
                <SimpleAccordion />
            </React.Fragment>
        );
    }
}

const element = <PageContent />;

ReactDOM.render(element, document.getElementById('contents'));