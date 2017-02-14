import http from 'http';
import url from 'url';
import { startCrawling } from './crawler';
import { startLoading } from './nightmare';
import d from 'Debug';

const debug = d('mainModule');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);
  debug('WE GOT HIT')
  if (parsedUrl.pathname.toLowerCase() === '/api' && parsedUrl.query.url) {
    debug('WE GOT HIT @ THE API ENDPOINT')
    start(parsedUrl)
      .then(data => {
        debug('Returning data: %o', data);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch(e => {
        const errorData = {
          msg: 'We could not finish your request',
          error: e,
        };
        res.writeHead(500, {'Content-Type': 'application/json'})
        res.write(JSON.stringify(errorData));
        res.end();
      })
  }
});

const start = (parsedUrl) => Promise.all([
  startCrawling(parsedUrl.query.url),
  startLoading(parsedUrl.query.url)
]).then((data) => new Promise((resolve, reject) => {
  if(data) {
    const returnOb = {
      "mobile­friendly": data[0].mobile,
      "title": data[0].title,
      "description": data[0].description,
      "imageURL": data[0].image,
      "loadTime": data[1]
    }
    console.log(require('util').inspect(returnOb, { depth: null, colors: true }));
    resolve(returnOb)
  } else {
    reject(false)
  }

}))

if(process.env.NODE_ENV==='development') {
  const urls = [
    'http://www.lunametrics.com/blog/2017/02/02/unlimited­data­studio­reports/',
    'http://news.abs­cbn.com/business/01/26/17/google­philippines­to­expand­workforce',
    'https://techcrunch.com/2016/12/15/comcast/',
    'http://www.latimes.com/business/technology/la­fi­tn­adobe­sensei­20161206­story.html',
    'http://www.infoworld.com/article/3162756/internet-of-things/google-strengthens-android-relationship-with-intel-in-iot.html',
  ];
  const allPromises = urls.map(el => start({
    query: {
      url: el
    }
  }))
  Promise.all(allPromises).then(data => {
    debug('%o',data);
  })
}

server.listen(port, hostname, () => {
  debug(`Server running at http://${hostname}:${port}/`);
});
