'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _crawler = require('./crawler');

var _nightmare = require('./nightmare');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hostname = '127.0.0.1';
var port = 3000;

var server = _http2.default.createServer(function (req, res) {
  var parsedUrl = _url2.default.parse(req.url, true);
  console.log('WE GOT HIT');
  if (parsedUrl.pathname.toLowerCase() === '/api' && parsedUrl.query.url) {
    console.log('WE GOT HIT @ THE API ENDPOINT');
    start(parsedUrl).then(function (data) {
      console.log(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(data));
      res.end();
    }).catch(function (e) {
      var errorData = {
        msg: 'We could not finish your request',
        error: e
      };
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(errorData));
      res.end();
    });
  }
});

var start = function start(parsedUrl) {
  return Promise.all([(0, _crawler.startCrawling)(parsedUrl.query.url), (0, _nightmare.startLoading)(parsedUrl.query.url)]).then(function (data) {
    return new Promise(function (resolve, reject) {
      resolve({
        "mobile­friendly": data[0].mobile,
        "title": data[0].title,
        "description": data[0].description,
        "imageURL": data[0].image,
        "loadTime": data[1]
      });
    });
  });
};

if (process.env.NODE_ENV === 'development') {
  start({
    query: {
      url: 'http://www.lunametrics.com/blog/2017/02/02/unlimited-data-studio-reports/'
    }
  }).then(function (data) {
    console.log(data);
  });
}

server.listen(port, hostname, function () {
  console.log('Server running at http://' + hostname + ':' + port + '/');
  for (var i = 0; i < 10; i++) {
    console.log('---------');
  }
});
//# sourceMappingURL=index.js.map