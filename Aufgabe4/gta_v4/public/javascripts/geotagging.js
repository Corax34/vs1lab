// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    let lat = document.getElementById("tagging-lat-input").value
    let long = document.getElementById("tagging-long-input").value
    if (lat == "" && long == "") {
        LocationHelper.findLocation(setLocation)
    } else {
        updateMapElement(lat, long)
    }
}

/**
 *  
 */
function updateMapElement(userLatitude, userLongitude) {
    let mapManager = new MapManager('37p52FyiX2zdpd7bYbOUhgUTiRp030A9')
    let lat = userLatitude
    let long = userLongitude
    let json_tags = document.getElementById("mapView").getAttribute("data-tags")
    let tags = JSON.parse(json_tags)
    let url = mapManager.getMapUrl(lat, long, tags)

    document.getElementById("mapView").src = url
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

function didSubmitDiscoveryFilterForm() {
    alert('lol')
}

function didSubmitTagForm() {
    alert('lol')
}

document.querySelector('#discoveryFilterForm').addEventListener('submit', function(e) {
    console.log('hello')
    if (!isValid) {
        e.preventDefault()
    }

    didSubmitDiscoveryFilterForm()
})

document.querySelector('#tag-form').addEventListener('submit', function(e) {
    console.log('hello')
    if (!isValid) {
        e.preventDefault()
    }

    didSubmitTagForm()
})

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});