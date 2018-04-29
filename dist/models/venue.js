"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongorito = require("mongorito");

/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
class Venue extends _mongorito.Model {}

Venue.index({
  location: "2dsphere"
});
var _default = Venue;
exports.default = _default;