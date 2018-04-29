"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAll = findAll;
exports.save = save;

var _venue = _interopRequireDefault(require("../models/venue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function findAll(req, res) {
  var condition = {},
      coords = []; // If coords are set

  if (req.params.coords) {
    coords = req.params.coords.split(",");
    coords = coords.map(parseFloat);
    coords.reverse(); // Set Conditions

    condition = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords
          },
          $minDistance: 0,
          $maxDistance: 10000
        }
      }
    };
  }

  let result = await _venue.default.where(condition).find();

  if (!result) {
    res.sendStatus(404);
    return;
  }

  res.json(result);
}

function save(req, res) {
  let items = req.body;

  if (!Array.isArray(items)) {
    items = [items];
  }

  items.forEach(item => {
    let venue = new _venue.default(item);
    venue.save();
  });
  res.sendStatus(200);
}