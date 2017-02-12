'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDom = exports.startCrawling = undefined;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _parse = require('parse5');

var _parse2 = _interopRequireDefault(_parse);

var _timer = require('../timer');

var _timer2 = _interopRequireDefault(_timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startCrawling = exports.startCrawling = function startCrawling(urlToCrawl) {
  var parsedUrl = _url2.default.parse(urlToCrawl);
  return getDom(parsedUrl).then(function (data) {
    return parseHeaders(data);
  }).catch(function (e) {
    return console.error(e);
  });
};

var getDom = exports.getDom = function getDom(parsedUrl) {
  return new Promise(function (resolve, reject) {
    var timer = new _timer2.default();
    var protocol = _http2.default;
    if (parsedUrl.protocol === 'https:') {
      var _protocol = _https2.default;
    }
    timer.start();
    protocol.get(parsedUrl, function (res) {
      var rawData = '';
      res.on('data', function (chunk) {
        return rawData += chunk;
      });
      res.on('end', function () {
        timer.stop();
        try {
          resolve(rawData);
        } catch (e) {
          reject(e.message);
        }
      });
    });
  });
};

var parseHeaders = function parseHeaders(data) {
  return new Promise(function (resolve, reject) {
    var document = _parse2.default.parse(data);
    var html = findDomNode('html', document);
    var head = findDomNode('head', html);
    var meta = findDomNodes('meta', head);
    var image = findContentByAttribute('og:image', 'property', meta); //TODO: Change this to a "batch" search
    var title = findContentByAttribute('og:title', 'property', meta); //TODO: Change this to a "batch" search
    var name = findContentByAttribute('og:site_name', 'property', meta); //TODO: Change this to a "batch" search
    var description = findContentByAttribute('description', 'name', meta); //TODO: Change this to a "batch" search
    resolve(image);
  });
};

var findContentByAttribute = function findContentByAttribute(attributeName, attribute, nodes) {
  var image = null;
  for (var j = 0; j < nodes.length; j++) {
    var nodeAttrs = nodes[j].attrs;
    var theMetaTag = null;
    var property = null;
    var content = null;
    for (var i = 0; i < nodeAttrs.length; i++) {
      if (nodeAttrs[i].name.toLowerCase() === attribute) {
        property = nodeAttrs[i].value;
      }
      if (nodeAttrs[i].name.toLowerCase() === 'content') {
        content = nodeAttrs[i].value;
      }
    }
    if (property && property.toLowerCase() === attributeName) {
      image = content;
      break;
    }
  }
  return image;
};

var findDomNode = function findDomNode(domName, subDom) {
  for (var i = 0; i < subDom.childNodes.length; i++) {
    if (subDom.childNodes[i].nodeName === domName) {
      return subDom.childNodes[i];
      break;
    }
  }
  return false;
};
var findDomNodes = function findDomNodes(domName, subDom) {
  var nodes = [];
  for (var i = 0; i < subDom.childNodes.length; i++) {
    if (subDom.childNodes[i].nodeName === domName) {
      nodes.push(subDom.childNodes[i]);
    }
  }
  return nodes;
};

exports.default = startCrawling;
//# sourceMappingURL=index.js.map