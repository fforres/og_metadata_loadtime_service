import http from 'http';
import url from 'url';
import { startCrawling } from './crawler';
import { startLoading } from './nightmare';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname == '/API' && parsedUrl.query.url) {
    start(parsedUrl)
  }
});

const start = (parsedUrl) => Promise.all([
  startCrawling(parsedUrl.query.url),
  startLoading(parsedUrl.query.url)
]).then(data => {
  console.log(data)
})

start({
  query: {
    url: 'http://www.lunametrics.com/blog/2017/02/02/unlimited-data-studio-reports/'
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  for (var i = 0; i < 10; i++) {
    console.log('---------')
  }
});
