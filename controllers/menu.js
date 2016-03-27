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

export async function save(req, res) {
    let date = req.params.date ? new Date(req.params.date) : new Date();
    let menu = await Menu.findOne({
        venue_id: req.params.venue_id,
        date: {date: {$gte: date, $lte: date}
    });

    if (menu) {
        res.sendStatus(403);
        return;
    }

    let newMenu = new Menu(Object.assign({
        venue_id: req.params.venue_id,
        date: date
    }, req.body));

    await newMenu.save();
    res.json(newMenu.toJSON());
}
