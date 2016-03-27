(function(module) {
    "use strict";

    var Meal = require('../models/meal'),
        Menu = require('../models/menu'),
        Venue = require('../models/venue');

    module.exports = {
        find: function(req, res) {
            var date = req.params.date ? new Date(req.params.date) : new Date();

            // Find the menu
            Menu.findOne({
                _venue: req.params.venue_id,
                date: {$gte: date, $lte: date}
            })
                .populate('_venue')
                .populate({path: 'meals', options: {sort: {'order': 1}} })
                .exec(function(err, menu) {
                    if (err || !menu) {
                        res.sendStatus(404);
                        return;
                    }
                    res.json(menu);
                });
        },

        save: function(req, res) {
            var date = req.params.date ? new Date(req.params.date) : new Date();

            Venue.findOne({_id: req.params.venue_id}, function(err, venue) {
                if (err || !venue) {
                    res.sendStatus(404);
                    return;
                }

                Menu.findOne({date: {$gte: date, $lte: date}}, function(err, existingMenu) {
                    if (err) {
                        res.sendStatus(500);
                    }
                    else if (!existingMenu) {
                        var menu = new Menu({
                            date: date,
                            _venue: venue
                        });

                        menu.save(function() {
                            res.json(menu);
                        });
                    } else {
                        res.json(existingMenu);
                    }
                });

            });
        },

        saveMeals: function(req, res) {
            Menu.findOne({_id: req.params.menu_id}, function(err, menu) {
                if(err) {
                    res.send(err);
                }

                var meals = req.body,
                    saved = 0, i = 0;

                if(meals.length) {
                    meals.forEach(function(m) {

                        var meal = new Meal({
                            title: m.title,
                            lang: m.lang,
                            flags: m.flags,
                            order: i++
                        });

                        meal.save(function() {
                            saved++;
                            menu.meals.push(meal);

                            if(saved === meals.length) {
                                menu.save(function() {
                                    res.json({success: true});
                                });
                            }
                        });
                    });
                } else {
                    res.json({suceess: false});
                }
            });
        }
    }
})(module);
