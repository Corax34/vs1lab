// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    let lat = document.getElementById("tagging-lat-input").value
    let long = document.getElementById("tagging-long-input").value
    if (lat == "" && long == "") {
        LocationHelper.findLocation(setLocation)
    }
}

function updateMapElement(userLatitude, userLongitude) {
    let mapManager = new MapManager('37p52FyiX2zdpd7bYbOUhgUTiRp030A9')
    let lat = userLatitude
    let long = userLongitude
    let json_tags = document.getElementById("mapView").getAttribute("data-tags")
    let tags = JSON.parse(json_tags)
    let url = mapManager.getMapUrl(lat, long, tags)

    document.getElementById("mapView").src = url
}

function updateMapWithGeotags(geotags) {
    let mapManager = new MapManager('37p52FyiX2zdpd7bYbOUhgUTiRp030A9')
    let latitude = parseFloat(document.getElementById('tagging-lat-input').value)
    let longitude = parseFloat(document.getElementById('tagging-long-input').value)
    console.log(geotags)
    let url = mapManager.getMapUrl(latitude, longitude, geotags)

    document.getElementById('mapView').src = url

    return geotags
}

function updateTagList(geotags) {
    let tags = geotags

    if(tags !== undefined) {
        let list = document.getElementById("discoveryResults")

        list.innerHTML = ''

        tags.forEach((tag) => {
            let listEntry = document.createElement('li')
            listEntry.innerHTML = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`
            list.appendChild(listEntry)
        })
    }
}

/**
 * A function to set the received location on the website.
 * It should be used as a callback function of the "updateLocation()" function.
 */
function setLocation(locationHelper) {
    let latitude = locationHelper.latitude;
    let longitude = locationHelper.longitude;

    document.getElementById("tagging-lat-input").value = String(latitude);
    document.getElementById("tagging-long-input").value = String(longitude);

    document.getElementById("discovery-lat-input").value = String(latitude);
    document.getElementById("discovery-long-input").value = String(longitude);

    updateMapElement(latitude, longitude)
}

// Request Geotags
async function getGeoTags(searchTerm = '') {
    let response = await fetch(`http://localhost:3000/api/geotags?&searchterm=${searchTerm}`)

    return await response.json()
}

// Create new GeoTag
async function createNewGeoTag(geotag) {
    let response = await fetch('http://localhost:3000/api/geotags', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag)
    })

    return await response.json()
}

document.getElementById('tag-form').addEventListener('submit', (event) => {
    event.preventDefault()

    createNewGeoTag({
        name: document.getElementById('name-input').value,
        latitude: document.getElementById('tagging-lat-input').value,
        longitude: document.getElementById('tagging-long-input').value,
        hashtag: document.getElementById('hashtag-input').value
    }).then(getGeoTags).then(updateMapWithGeotags).then(updateTagList)
    
    document.getElementById('name-input').value = ''
    document.getElementById('hashtag-input').value = ''
    document.getElementById('search-input').value = ''
})

document.getElementById("discoveryFilterForm").addEventListener("submit", (event) => {
    event.preventDefault()

    let searchTerm = document.getElementById("search-input").value
    getGeoTags(searchTerm).then(updateMapWithGeotags).then(updateTagList)
        .catch(error => alert("Search term does not exist"));
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    getGeoTags().then(updateMapWithGeotags)
});