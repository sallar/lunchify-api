/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
(function() {
    "use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    /* schema */
    var MenuSchema = new Schema({
        _venue: {type: Schema.Types.ObjectId, ref: 'Venue'},
        meals: [{type: Schema.Types.ObjectId, ref: 'Meal'}],
        date: Date
    });

    /* export */
    module.exports = mongoose.model('Menu', MenuSchema);
})();