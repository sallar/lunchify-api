/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
(function() {
    "use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    /* schema */
    var VenueSchema = new Schema({
        _id: Schema.Types.ObjectId,
        address: String,
        lat: Number,
        lng: Number,
        link: String,
        name: String,
        simple_name: String
    });

    /* export */
    module.exports = mongoose.model('Venue', VenueSchema);
})();