import url from 'url';
import http from 'http';
import https from 'https';
import parse5 from 'parse5';
import Timer from '../timer';
import d from 'Debug';

const debug = d('crawler');

export const startCrawling = (urlToCrawl) => {
  const parsedUrl = url.parse(urlToCrawl);
  return getDom(parsedUrl)
    .then(data => parseHeaders(data))
    .catch(e => debug('_ %s %o',e, parsedUrl.protocol));
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
  }).on('error', (e) => {
    reject(e)
  })

})

const parseHeaders = (data) => new Promise ((resolve, reject) => {
  const document = parse5.parse(data);
  /*
    TODO: We should chain this into promises for easy error handling
      findDomNode('html', document)
      .then((html) => findDomNode('head', html))
      .then((head) => findDomNode('meta', head))
      .then( (...) )
      .catch()
  */
  const html = findDomNode('html', document);
  const head = findDomNode('head', html);
  const meta = findDomNodes('meta', head)

  // TODO: parse Stylesheets and check for media queries.
  const mobile = checkMetasForMobile(meta); //TODO: Change this to a "batch" search
  const image = findContentByAttribute('og:image','property', meta); //TODO: Change this to a "batch" search
  const title = findContentByAttribute('og:title','property', meta); //TODO: Change this to a "batch" search
  const name = findContentByAttribute('og:site_name','property', meta); //TODO: Change this to a "batch" search
  const description = findContentByAttribute('description','name', meta); //TODO: Change this to a "batch" search
  resolve({image, title, name, description, mobile})
})

const checkMetasForMobile = (metaTags) => { //TODO: CHECK: We could use something like this: https://gist.github.com/shahariaazam/73c0644c6b2f2cba5ca2#file-google-mobile-friendliness-test-php/
  //'https://www.googleapis.com/pagespeedonline/v3beta1/mobileReady?key='.$apiKey.'&url='.$url.'&strategy=mobile'
  const viewPort = findContentByAttribute('viewport', 'name', metaTags);
  const parsedViewportAttribute = {};
  if (viewPort) {
    viewPort.split(',').forEach((el) => {
      const splitted = el.split('=');
      parsedViewportAttribute[splitted[0].trim()] = splitted[1].trim();
    })
    var checker = [
      'width',
      'initial-scale'
    ];
    debug('%o', parsedViewportAttribute)
    if(parsedViewportAttribute[checker[0]] && parsedViewportAttribute[checker[1]]) { // TODO: This should have more depth
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// This goes tyhrough every meta-tag and extract a specific meta tag content
const findContentByAttribute = (attributeName, attribute, nodes) => {
  var data = null;
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
      data = content
      break;
    }
  }
  return data;
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
