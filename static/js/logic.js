// identify API endpoint as queryUrl

// let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-01-01&endtime=2023-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';


function markerRadius(magnitude) {
    radius = magnitude * 1.5; // allow easier 'fine-tuning of marker size on map
    return radius;
};

function markerColor(depth) {
    // color_list = ['green', 'lime', 'yellow', 'orange', 'burnt_orange', 'red']; // initial color palette
    // color_list = ['green', 'lime', 'yellow', 'orange', 'burnt-orange', 'red'];
    //color_list = ['#66cc00', '#cccc00', '#cc9900', '#cc6600', '#cc3300', '#cc0000']; //red-green
    // color_list = ['#ccffff', '#66ccff', '#33ccff', '#0099ff', '#0000ff', '#000099']; // blues
    color_list = ['#e0ccff', '#c299ff', '#a366ff', '#8533ff', '#6600ff', '#4700b3']; // blues


    if (depth >= 90) {
        return color_list[5];
    } else if (depth < 90 && depth >= 70) {
        return color_list[4];
    } else if (depth < 70 && depth >= 50) {
        return color_list[3];
    } else if (depth < 50 && depth >= 30) {
        return color_list[2];
    } else if (depth < 30 && depth >= 10) {
        return color_list[1];
    } else if (depth < 10 && depth >= -10) {
        return color_list[0];
    }
};

function createMarker(feature, latlng) {

    let magnitude = feature.properties.mag;
    let depth = feature.geometry.coordinates[2];

    let markerOptions = {
        radius: markerRadius(magnitude),
        fillColor: markerColor(depth),
        color: markerColor(depth),
        fillOpacity: 0.7,
        opacity: 0.9,
        weight: 1
    }

    return L.circleMarker(latlng, markerOptions);

};

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
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Send data to map
    createMap(earthquakes);

    };
    
function createMap(earthquakes) {
    

    // Create base layers.
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    // Create baseMaps object.
    let baseMaps = {
        "Base Map": base,
        "Topographic Map": topo,
        "USGS Topographic": USGS_USTopo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.

    // Map bounds
    //const corner1 = L.latLng(-70, -180);
    //const corner2 = L.latLng(10, 180);
    //const bounds = L.latLngBounds(corner1, corner2);

    let map = L.map("map", {
        
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        layers: [base, earthquakes],
        //maxBounds: bounds
        
    });
    
    map.setView([10, -80], 2.5);

    // Create a layer control.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // add Legend

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'legend'),
            // grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            grades = [-10, 10, 30, 50, 70, 90],
            legendHeading = "<h4>Estim. Depth (Km)";

            div.innerHTML += legendHeading;
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(map);
}