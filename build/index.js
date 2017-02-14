'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _crawler = require('./crawler');

var _nightmare = require('./nightmare');

var _Debug = require('Debug');

var _Debug2 = _interopRequireDefault(_Debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _Debug2.default)('mainModule');
var hostname = '127.0.0.1';
var port = 3000;

var server = _http2.default.createServer(function (req, res) {
  var parsedUrl = _url2.default.parse(req.url, true);
  debug('WE GOT HIT');
  if (parsedUrl.pathname.toLowerCase() === '/api' && parsedUrl.query.url) {
    debug('WE GOT HIT @ THE API ENDPOINT');
    start(parsedUrl).then(function (data) {
      debug('Returning data: %o', data);
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
      if (data) {
        var returnOb = {
          "mobile­friendly": data[0].mobile,
          "title": data[0].title,
          "description": data[0].description,
          "imageURL": data[0].image,
          "loadTime": data[1]
        };
        console.log(require('util').inspect(returnOb, { depth: null, colors: true }));
        resolve(returnOb);
      } else {
        reject(false);
      }
    });
  });
};

if (process.env.NODE_ENV === 'development') {
  var urls = ['http://www.lunametrics.com/blog/2017/02/02/unlimited­data­studio­reports/', 'http://news.abs­cbn.com/business/01/26/17/google­philippines­to­expand­workforce', 'https://techcrunch.com/2016/12/15/comcast/', 'http://www.latimes.com/business/technology/la­fi­tn­adobe­sensei­20161206­story.html', 'http://www.infoworld.com/article/3162756/internet-of-things/google-strengthens-android-relationship-with-intel-in-iot.html'];
  var allPromises = urls.map(function (el) {
    return start({
      query: {
        url: el
      }
    });
  });
  Promise.all(allPromises).then(function (data) {
    debug('%o', data);
  });
}

server.listen(port, hostname, function () {
  debug('Server running at http://' + hostname + ':' + port + '/');
});
//# sourceMappingURL=index.js.map