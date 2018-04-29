const Venue = require("../models/venue");

export async function findAll(req, res) {
    var condition = {},
        coords = [];

    // If coords are set
    if (req.params.coords) {
        coords = req.params.coords.split(",");
        coords = coords.map(parseFloat);
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

    let result = await Venue.where(condition).find();

    if (!result) {
        res.sendStatus(404);
        return;
    }

    res.json(result);
}

export function save(req, res) {
    let items = req.body;

    if (!Array.isArray(items)) {
        items = [items];
    }

    items.forEach(item => {
        let venue = new Venue(item);
        venue.save();
    });

    res.sendStatus(200);
}
