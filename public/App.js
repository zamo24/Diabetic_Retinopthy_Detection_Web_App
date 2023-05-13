"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = require("react");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
// import { ReactDOM } from 'react-dom';
// import { Typography } from '@mui/material';
var AppHeader = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(AppHeader, _React$Component);
  var _super = _createSuper(AppHeader);
  function AppHeader() {
    (0, _classCallCheck2.default)(this, AppHeader);
    return _super.apply(this, arguments);
  }
  (0, _createClass2.default)(AppHeader, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.React.createElement("div", null, /*#__PURE__*/_react.React.createElement("h1", null, "Eye Disease App"));
    }
  }]);
  return AppHeader;
}(_react.React.Component);
var IngestImage = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2.default)(IngestImage, _React$Component2);
  var _super2 = _createSuper(IngestImage);
  function IngestImage() {
    (0, _classCallCheck2.default)(this, IngestImage);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2.default)(IngestImage, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.React.createElement(_react.React.Fragment, null, /*#__PURE__*/_react.React.createElement("p", null, "Upload a picture of your eye:"));
    }
  }]);
  return IngestImage;
}(_react.React.Component);
var ExampleImage = /*#__PURE__*/function (_React$Component3) {
  (0, _inherits2.default)(ExampleImage, _React$Component3);
  var _super3 = _createSuper(ExampleImage);
  function ExampleImage() {
    (0, _classCallCheck2.default)(this, ExampleImage);
    return _super3.apply(this, arguments);
  }
  (0, _createClass2.default)(ExampleImage, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.React.createElement(_react.React.Fragment, null, /*#__PURE__*/_react.React.createElement("p", null, "Here is an example of what the image should look like"));
    }
  }]);
  return ExampleImage;
}(_react.React.Component);
var PageContent = /*#__PURE__*/function (_React$Component4) {
  (0, _inherits2.default)(PageContent, _React$Component4);
  var _super4 = _createSuper(PageContent);
  function PageContent() {
    (0, _classCallCheck2.default)(this, PageContent);
    return _super4.apply(this, arguments);
  }
  (0, _createClass2.default)(PageContent, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.React.createElement(_react.React.Fragment, null, /*#__PURE__*/_react.React.createElement(AppHeader, null), /*#__PURE__*/_react.React.createElement("hr", null), /*#__PURE__*/_react.React.createElement(IngestImage, null), /*#__PURE__*/_react.React.createElement("hr", null), /*#__PURE__*/_react.React.createElement(ExampleImage, null));
    }
  }]);
  return PageContent;
}(_react.React.Component);
var element = /*#__PURE__*/_react.React.createElement(PageContent, null);
ReactDOM.render(element, document.getElementById('contents'));