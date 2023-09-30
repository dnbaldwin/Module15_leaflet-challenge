// Store our API endpoint as queryUrl.
// let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-01-01&endtime=2023-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson';



// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log("data: ", data);

    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Add descriptive popup to each earthquake event
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create JSON layer
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    var geojsonMarkerOptions = {
        radius: feature.properties.mag,

    }
    // Send data to map
    createMap(earthquakes);
}

function createMap(earthquakes) {


    // Create base layers.
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create baseMaps object.
    let baseMaps = {
        "Base Map": base,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let map = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [base, earthquakes]
    });

    // markers ref: observablehq.com




    // Create a layer control.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}