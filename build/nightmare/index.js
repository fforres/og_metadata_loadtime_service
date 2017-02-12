'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startLoading = undefined;

var _nightmare = require('nightmare');

var _nightmare2 = _interopRequireDefault(_nightmare);

var _timer = require('../timer');

var _timer2 = _interopRequireDefault(_timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nightmare = (0, _nightmare2.default)();

var startLoading = exports.startLoading = function startLoading(url) {
  return new Promise(function (resolve, reject) {
    var timer = new _timer2.default();
    timer.start();
    nightmare.goto(url).wait().run(function () {
      timer.stop();
      var time = timer.calculate();
      resolve(time);
    }).catch(function (error) {
      console.error('Search failed:', error);
    });
  });
};
exports.default = startLoading;
//# sourceMappingURL=index.js.map