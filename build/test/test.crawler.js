'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _crawler = require('../crawler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('starts crawl', function (t) {
  var url = 'http://www.lunametrics.com/blog/2017/02/02/unlimited­data­studio­reports/';
  (0, _crawler.startCrawling)(url);
  t.pass();
});
//# sourceMappingURL=test.crawler.js.map