import Menu from "../models/menu.js";
import Venue from "../models/venue.js";

export async function find(req, res) {
    let date = req.params.date ? new Date(req.params.date) : new Date();
    let menu = await Menu.findOne({
        venue_id: req.params.venue_id,
        date: {$gte: date, $lte: date}
    });

    if (!menu) {
        res.sendStatus(404);
        return;
    }

    res.json(menu.toJSON());
}

async function saveMenu(venueID, data) {
    let date = new Date(data.date);
    let menu = await Menu.findOne({
        venue_id: venueID,
        date: {$gte: date, $lte: date}
    });

    if (!menu) {
        menu = new Menu(Object.assign({
            venue_id: venueID,
            date: date,
            meals: data.menu
        }));
        await menu.save();
    }

    return menu.toJSON();
}

export async function save(req, res) {
    let body = req.body;

    if (!Array.isArray(body)) {
        body = [body];
    }

    let result = body.map(menu => saveMenu(req.params.venue_id, menu));
    Promise.all(result).then(data => {
        res.json(data);
    })
}
