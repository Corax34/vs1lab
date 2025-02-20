// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
const GeoTagExamples = require('../models/geotag-examples')

var storage = GeoTagExamples.create()

router.get('/', (req, res) => {
  res.render('index', { taglist: storage.geotags, latValue: "", longValue: "",  })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  console.log("route /tagging")
  console.log(req.body)

  // req.body contains variables passed in the post formular
  var name = req.body["name"]
  var lat = req.body["lat"]
  var long = req.body["long"]
  var hashtag = req.body["hashtag"]
  var geotag = new GeoTag(name, lat, long, hashtag)

  console.log("lat tagging:")
  console.log(lat)

  storage.addGeoTag(geotag)
  var nearbyTags = storage.getNearbyGeoTags({latitude: lat, longitude: long})

  // pass variables to view
  res.render('index', {taglist: nearbyTags, latValue: lat, longValue: long}) 
})

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

 router.post('/discovery', (req, res) => {
  console.log("route /discovery")
  console.log(req.body)

  // req.body contains variables passed in the post formular
  var lat = req.body["lat"]
  var long = req.body["long"]
  var keyword = req.body["search-input"]
  var nearbyTags = storage.searchNearbyGeoTags({latitude: lat, longitude: long}, keyword)

  // pass variables to view
  res.render('index', {taglist: nearbyTags, latValue: lat, longValue: long})
})

module.exports = router;
