/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
(function() {
    "use strict";

    // INCLUDE WHAT WE NEED
    // =============================================================================
    var express    = require('express');        // call express
    var app        = express();                 // define our app using express
    var bodyParser = require('body-parser');

    // DATABASE
    // =============================================================================
    var mongoose   = require('mongoose');
    mongoose.connect('mongodb://localhost/lunchify'); // connect to our database

    // BASE SETUP
    // =============================================================================
    var Venue     = require('./app/models/venue');
    var Meal      = require('./app/models/meal');
    var Menu      = require('./app/models/menu');

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
    router.route('/venues')

        /* Get the list of venues */
        .get(function(req, res) {
            Venue.find(function(err, venues) {
                if (err) {
                    res.send(err);
                }

                res.json(venues);
            });
        });

    /* single venue */
    router.route('/venues/:venue_id/:date?')

        /* get venues menu */
        .get(function(req, res) {
            // Calculate the date
            var t = new Date(),
                d = (req.params.date) ? req.params.date : [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');

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
        });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    // START THE SERVER
    // =============================================================================
    app.listen(8080);
    console.log('Magic happens');

})();