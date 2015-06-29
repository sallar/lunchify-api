/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
(function() {
    "use strict";

    // INCLUDE WHAT WE NEED
    // =============================================================================
    var express    = require('express'),
        app        = express(),
        bodyParser = require('body-parser'),
        util       = require('util'),
        mongoose   = require('mongoose');

    // BASE SETUP
    // =============================================================================
    var Venue      = require('./app/models/venue'),
        Meal       = require('./app/models/meal'),
        Menu       = require('./app/models/menu');

    /* Connect to Mongoose */
    mongoose.connect('mongodb://localhost/lunchify');

    // ROUTES FOR OUR API
    // =============================================================================
    /* configure app to use bodyParser() */
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    /* get an instance of the express Router */
    var router = express.Router();

    /* home route */
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    /* all venues */
    router.route('/venues/:coords?')

        /* Get the list of venues */
        .get(function(req, res) {
            var condition = {},
                coords    = [];

            // If coords are set
            if(req.params.coords) {
                coords = req.params.coords.split(',');
                coords.reverse();

                // Set Conditions
                condition = {
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: coords
                            },
                            $minDistance: 0,
                            $maxDistance: 2000
                        }
                    }
                };
            }

            // Find the Venue
            Venue.find(condition, function(err, venues) {
                if(err) {
                    res.send(err);
                }

                res.json(venues);
            });
        })

        /* Save a new venue */
        .post(function(req, res) {
            if(util.isArray(req.body)) {
                req.body.forEach(function(item) {
                    var venue = new Venue(item);
                    venue.save();
                });
                res.json({success: true});
            }
            else {
                var venue = new Venue(req.body);
                venue.save(function() {
                    res.json(venue);
                });
            }
        });

    /* single venue */
    router.route('/venues/:venue_id/:date?')

        /* get venues menu */
        .get(function(req, res) {
            // Calculate the date
            var t = new Date(),
                d = req.params.date || [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');

            // Find the menu
            Menu.findOne({
                _venue: req.params.venue_id,
                date: {$gte: new Date(d)}
            })
                .populate('_venue')
                .populate('meals')
                .exec(function(err, menu) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(menu);
                });
        })

        /* create a new menu */
        .post(function(req, res) {
            var date = req.params.date ? new Date(req.params.date) : new Date();

            Venue.findOne({_id: req.params.venue_id}, function(err, venue) {
                var menu = new Menu({
                    date: date,
                    _venue: venue
                });

                menu.save(function() {
                    res.json(menu);
                });
            });
        });

    /* single menu */
    router.route('/menus/:menu_id')

        /* Save new meals */
        .post(function(req, res) {
            Menu.findOne({_id: req.params.menu_id}, function(err, menu) {
                var meal = new Meal({
                    name: req.body.name,
                    name_alt: req.body.name_alt,
                });

                meal.save(function() {
                    menu.meals.push(meal);
                    menu.save(function() {
                        res.json(meal);
                    });
                });
            });
        });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    // START THE SERVER
    // =============================================================================
    app.listen(8080);
    console.log('Magic happens');

})();