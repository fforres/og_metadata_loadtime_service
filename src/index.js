import http from 'http';
import url from 'url';
import { startCrawling } from './crawler';
import { startLoading } from './nightmare';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);
  console.log('WE GOT HIT')
  if (parsedUrl.pathname.toLowerCase() === '/api' && parsedUrl.query.url) {
    console.log('WE GOT HIT @ THE API ENDPOINT')
    start(parsedUrl)
      .then(data => {
        console.log(data);
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
  resolve({
    "mobile­friendly": data[0].mobile,
    "title": data[0].title,
    "description": data[0].description,
    "imageURL": data[0].image,
    "loadTime": data[1]
  })
}))

if(process.env.NODE_ENV==='development') {
  start({
    query: {
      url: 'http://www.lunametrics.com/blog/2017/02/02/unlimited-data-studio-reports/'
    }
  }).then(data => {
    console.log(data)
  })
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  for (var i = 0; i < 10; i++) {
    console.log('---------')
  }
});
