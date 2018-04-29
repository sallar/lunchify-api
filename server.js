/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
const mongorito = require("mongorito");
const express = require("express");
const bodyParser = require("body-parser");

// Controllers
const Venues = require("./controllers/venues");
const Menu = require("./controllers/menu");

mongorito
    .connect("localhost/lunchify")
    .then(() => {
        const app = express();
        const router = express.Router();

        // configure app to use bodyParser()
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // home route
        router.get("/", function(req, res) {
            res.sendStatus(403);
        });

        // all venues
        router
            .route("/venues/:coords?")
            .get(Venues.findAll)
            .post(Venues.save);

        // single venue
        router
            .route("/venues/:venue_id/menu/:date?")
            .get(Menu.find)
            .post(Menu.save);

        // all of our routes will be prefixed with /api
        app.use("/api", router);
        app.use("/", express.static("./public"));
        app.listen(8080);
    })
    .catch(err => {
        console.error(err);
    });
