// File origin: VS1LAB A3

const InMemoryGeoTagStore = require("./geotag-store");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class representing example geoTags at HKA
 * 
 * TODO: populate your InMemoryGeoTagStore with these tags
 * 
 */
class GeoTagExamples {
    static create() {
        this.myStorage = new InMemoryGeoTagStore()


        for(var i = 0; i < GeoTagExamples.tagList.length; i++) {
            var gname = GeoTagExamples.tagList[i][0]
            var glatitude = GeoTagExamples.tagList[i][1]
            var glongitude = GeoTagExamples.tagList[i][2]
            var ghashtag = GeoTagExamples.tagList[i][3]
            this.myStorage.addGeoTag({name: gname,  latitude: glatitude, longitude: glongitude, hashtag: ghashtag})
        }

        return this.myStorage
    }
     
    /**
     * Provides some geoTag data
     */
    static get tagList() {
        return [
            ['Castle', 49.013790, 8.404435, '#sight'],
            ['IWI', 49.013790, 8.390071, '#edu'],
            ['Building E', 49.014993, 8.390049, '#campus'],
            ['Building F', 49.015608, 8.390112, '#campus'],
            ['Building M', 49.016171, 8.390155, '#campus'],
            ['Building LI', 49.015636, 8.389318, '#campus'],
            ['Auditorium He', 49.014915, 8.389264, '#campus'],
            ['Building R', 49.014992, 8.392365, '#campus'],
            ['Building A', 49.015738, 8.391619, '#campus'],
            ['Building B', 49.016843, 8.391372, '#campus'],
            ['Building K', 49.013190, 8.392090, '#campus'],
        ];
    }

}

module.exports = GeoTagExamples;
