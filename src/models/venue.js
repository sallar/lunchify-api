/**
 * @author Sallar Kaboli <sallar.kaboli@gmail.com>
 * @date 6/22/15.
 */
import { Model } from "mongorito";

class Venue extends Model {}

Venue.index({ location: "2dsphere" });

export default Venue;
