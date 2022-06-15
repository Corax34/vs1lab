// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();
const uuidValidate = require('uuid').validate

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

const GeoTagExamples = require('../models/geotag-examples')

var storage = new GeoTagStore()

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
router.get('/api/geotags', (req, res) => {
  let searchterm = req.body['searchterm']
  let latitude = req.body['latitude']
  let longitude = req.body['longitude']
  if(searchterm != '' && searchterm != undefined) {
    if(latitude != undefined && latitude != '' && longitude != undefined && longitude != '') {
      res.json(storage.searchNearbyGeoTags({latitude: latitude, longitude: longitude}, searchterm))
    } else {
      res.json(storage.searchGeoTags(searchterm))
    }
  } else {
    res.json(storage.getAllGeoTags())
  }
})


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  var name = req.body["name"]
  var lat = req.body["lat"]
  var long = req.body["long"]
  var hashtag = req.body["hashtag"]
  var geotag = new GeoTag(name, lat, long, hashtag)
  
  storage.addGeoTag(geotag)

  res.json(geotag)
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
router.get('/api/geotags/:id', (req, res) => {
  let id = req.params.id

  if(uuidValidate(id)) {
    res.json(storage.getGeoTagById(id)) // We assume that only one GeoTag with one unique UUID can exist.
  } else {
    res.json({error: 'Invalid UUID.'})
  }
})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

 router.put('/api/geotags/:id', (req, res) => {
  let id = req.params.id

  if(uuidValidate(id)) {
    res.json(storage.updateGeoTagWithId(id, req.body["name"], req.body["lat"], req.body["long"], req.body["hashtag"]))
  } else {
    res.json({error: 'Invalid UUID.'})
  }
})

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
router.delete('/api/geotags/:id', (req, res) => {
  let id = req.params.id

  if(uuidValidate(id)) {
    res.json(storage.removeGeoTagWithId(id))
  } else {
    res.json({error: 'Invalid UUID'})
  }
})

module.exports = router;
