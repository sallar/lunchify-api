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
        address: String,
        location: {type: [Number], index: '2dsphere'},
        link: String,
        name: String,
        simple_name: String
    });

    /* index */
    VenueSchema.index({location: '2dsphere'});

    /* export */
    module.exports = mongoose.model('Venue', VenueSchema);
})();