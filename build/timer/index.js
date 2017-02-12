"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Timer;
function Timer() {}

Timer.prototype.start = function start() {
  this.startTime = +new Date();
};
Timer.prototype.stop = function stop() {
  this.stopTime = +new Date();
};
Timer.prototype.calculate = function calculate() {
  this.difference = this.stopTime - this.startTime;
  return this.difference;
};
//# sourceMappingURL=index.js.map