// File origin: VS1LAB A3

const uuidv4 = require('uuid').v4

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    constructor(name, latitude, longitude, hashtag) {
        this.id = uuidv4()
        this.name = name
        this.latitude = latitude
        this.longitude = longitude
        this.hashtag = hashtag
    }

    getId() {
        return this.id
    }
    
}

module.exports = GeoTag;
