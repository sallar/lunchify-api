/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
(function() {
    "use strict";

    var express    = require('express'),
        bodyParser = require('body-parser'),
        mongoose   = require('mongoose'),
        Venues     = require('./controllers/venues'),
        Menu       = require('./controllers/menu'),
        app        = express(),
        router     = express.Router();

    // Connect to Mongoose
    mongoose.connect('mongodb://localhost/lunchify');

    // configure app to use bodyParser()
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // home route
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // all venues
    router.route('/venues/:coords?')
        .get(Venues.findAll)
        .post(Venues.save);

    // single venue
    router.route('/venues/:venue_id/menu/:date?')
        .get(Menu.find)
        .post(Menu.save);

    // single menu
    router.route('/menus/:menu_id')
        .post(Menu.saveMeals);

    // all of our routes will be prefixed with /api
    app.use('/api', router);
    app.listen(80);

})();
