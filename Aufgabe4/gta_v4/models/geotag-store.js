// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    constructor() {
        this.geotags = []
        this.proximity = 5 // km
    }

    addGeoTag(geotag) {
        this.geotags.push(geotag)
    }
    
    removeGeoTag(name) {
        this.geotags = geotags.filter(function(geotag) {
            return geotag.name != name
        })
    }

    removeGeoTagWithId(id) {
        let toBeRemoved = this.getGeoTagById(id)
        
        if(toBeRemoved != undefined) {
            this.geotags = this.geotags.filter((geotag) => geotag.id != id)

            return toBeRemoved
        } else {
            return { error: `GeoTag with id ${id} doesn't exist.`}
        }
    }

    getAllGeoTags() {
        return this.geotags
    }

    // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }
      
      deg2rad(deg) {
        return deg * (Math.PI/180)
      }

    getNearbyGeoTags(location) {
        var self = this

        var locations = this.geotags.filter(function(geotag) {
            var distance = self.getDistanceFromLatLonInKm(location.latitude, location.longitude, geotag.latitude, geotag.longitude)

            return distance < self.proximity
        })

        return locations
    }

    searchNearbyGeoTags(location, keyword) {
        var self = this

        var locations = this.geotags.filter(function(geotag) {
            var distance = self.getDistanceFromLatLonInKm(location.latitude, location.longitude, geotag.latitude, geotag.longitude)
            var regex = new RegExp("[\s\S]*" + keyword + "[\s\S]*")

            return distance < self.proximity && (regex.exec(geotag.name) || regex.exec(geotag.hashtag))
        })

        return locations
    }

    searchGeoTags(keyword) {
        var locations = this.geotags.filter((geotag) => {
            var regex = new RegExp("[\s\S]*" + keyword + "[\s\S]*")

            return regex.exec(geotag.name) || regex.exec(geotag.hashtag)
        })

        return locations
    }

    getGeoTagById(id) {
        let geotag = this.geotags.find(geotag => geotag.id === id)

        if(geotag != undefined) {
            return geotag
        } else {
            return {error: `Geotag with id ${id} not found.`}
        }
    }

    updateGeoTagWithId(id, name, lat, long, hashtag) {
        let i = this.geotags.findIndex(geotag => geotag.id === id);

        if(this.geotags[i] != undefined) {
            this.geotags[i].name = name
            this.geotags[i].lat = lat
            this.geotags[i].long = long
            this.geotags[i].hashtag = hashtag

            return this.geotags[i]
        }

        return {error: `Geotag with id ${id} not found.`}
    }
}

module.exports = InMemoryGeoTagStore
