"use strict";

var _mongorito = _interopRequireDefault(require("mongorito"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
_mongorito.default.connect("localhost/lunchify").then(() => {
  const app = (0, _express.default)();

  const router = _express.default.Router(); // configure app to use bodyParser()


  app.use(_bodyParser.default.urlencoded({
    extended: true
  }));
  app.use(_bodyParser.default.json()); // home route

  router.get("/", function (req, res) {
    res.sendStatus(403);
  }); // Controllers

  const Venues = require("./controllers/venues");

  const Menu = require("./controllers/menu"); // all venues


  router.route("/venues/:coords?").get(Venues.findAll).post(Venues.save); // single venue

  router.route("/venues/:venue_id/menu/:date?").get(Menu.find).post(Menu.save); // all of our routes will be prefixed with /api

  app.use("/api", router);
  app.use("/", _express.default.static("../public"));
  app.listen(8080);
}).catch(err => {
  console.error(err);
});