(function(module) {
    "use strict";

    var util = require('util'),
        Venue = require('../models/venue');

    module.exports = {
        findAll: function(req, res) {
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
                            $maxDistance: 10000
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
        },

        save: function(req, res) {
            if(util.isArray(req.body)) {
                req.body.forEach(function(item) {
                    var venue = new Venue(item);
                    venue.save();
                });
                res.json({success: true});
            }
            else {
                console.log("saving");
                var venue = new Venue(req.body);
                venue.save(function() {
                    console.log(arguments);
                    res.json(venue);
                });
            }
        }
    }
})(module);
