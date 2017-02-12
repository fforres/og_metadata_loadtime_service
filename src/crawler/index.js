import url from 'url';
import http from 'http';
import https from 'https';
import parse5 from 'parse5';
import Timer from '../timer';

export const startCrawling = (urlToCrawl) => {
  const parsedUrl = url.parse(urlToCrawl);
  return getDom(parsedUrl)
    .then(data => {
      return parseHeaders(data)
    })
    .catch(e => console.error(e));
}

export const getDom = (parsedUrl) => new Promise ((resolve, reject) => {
  const timer = new Timer();
  let protocol = http;
  if(parsedUrl.protocol === 'https:') {
    let protocol = https;
  }
  timer.start();
  protocol.get(parsedUrl, (res) => {
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      timer.stop();
      try {
        resolve(rawData);
      } catch (e) {
        reject(e.message);
      }
    });
  })
})

const parseHeaders = (data) => new Promise ((resolve, reject) => {
  const document = parse5.parse(data);
  const html = findDomNode('html', document);
  const head = findDomNode('head', html);
  const meta = findDomNodes('meta', head);
  const image = findContentByAttribute('og:image','property', meta); //TODO: Change this to a "batch" search
  const title = findContentByAttribute('og:title','property', meta); //TODO: Change this to a "batch" search
  const name = findContentByAttribute('og:site_name','property', meta); //TODO: Change this to a "batch" search
  const description = findContentByAttribute('description','name', meta); //TODO: Change this to a "batch" search
  resolve(image)
})

const findContentByAttribute = (attributeName, attribute, nodes) => {
  var image = null;
  for (let j = 0; j < nodes.length; j++) {
    let nodeAttrs = nodes[j].attrs;
    let theMetaTag = null;
    var property = null;
    var content = null;
    for (let i = 0; i < nodeAttrs.length; i++) {
      if(nodeAttrs[i].name.toLowerCase() === attribute){
        property = nodeAttrs[i].value;
      }
      if(nodeAttrs[i].name.toLowerCase() === 'content'){
        content = nodeAttrs[i].value;
      }
    }
    if(property && property.toLowerCase() === attributeName) {
      image = content
      break;
    }
  }
  return image;
}


const findDomNode = (domName, subDom) => {
  for (var i = 0; i < subDom.childNodes.length; i++) {
    if(subDom.childNodes[i].nodeName === domName) {
      return subDom.childNodes[i];
      break;
    }
  }
  return false;
}
const findDomNodes = (domName, subDom) => {
  const nodes = [];
  for (var i = 0; i < subDom.childNodes.length; i++) {
    if(subDom.childNodes[i].nodeName === domName) {
      nodes.push(subDom.childNodes[i]);
    }
  }
  return nodes;
}

export default startCrawling;
