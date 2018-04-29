"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.save = save;

var _menu = _interopRequireDefault(require("../models/menu"));

var _venue = _interopRequireDefault(require("../models/venue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function find(req, res) {
  let date = req.params.date ? new Date(req.params.date) : new Date();
  let menu = await _menu.default.findOne({
    venue_id: req.params.venue_id,
    date: {
      $gte: date,
      $lte: date
    }
  });

  if (!menu) {
    res.sendStatus(404);
    return;
  }

  res.json(menu.toJSON());
}

async function saveMenu(venueID, data) {
  let date = new Date(data.date);
  let menu = await _menu.default.findOne({
    venue_id: venueID,
    date: {
      $gte: date,
      $lte: date
    }
  });

  if (!menu) {
    menu = new _menu.default(Object.assign({
      venue_id: venueID,
      date: date,
      meals: data.menu
    }));
    await menu.save();
  }

  return menu.toJSON();
}

async function save(req, res) {
  let body = req.body;

  if (!Array.isArray(body)) {
    body = [body];
  }

  let result = body.map(menu => saveMenu(req.params.venue_id, menu));
  Promise.all(result).then(data => {
    res.json(data);
  });
}