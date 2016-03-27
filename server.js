/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
import mongorito from "mongorito";
import express from "express";
import bodyParser from "body-parser";

mongorito.connect('localhost/lunchify').then(() => {
    const app = express();
    const router = express.Router();

    // Controllers
    const Venues = require('./controllers/venues');
    const Menu = require('./controllers/menu');

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
    app.listen(8080);
}).catch(err => {
    console.error(err);
});
