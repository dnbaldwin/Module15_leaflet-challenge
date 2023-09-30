// init

function init() {
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-09-21&endtime=2023-09-27"

    d3.json(url).then(function (data) {
        console.log(data)

        createFeatures(data.features);
    })
}

function createFeatures(response) {
    // bind pop up to each earthquake event feature, with info
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // create GeoJSON layer
    let earthquakes = L.geoJSON(response, {
        onEachFeature: onEachFeature
    });

    // send data to map
    createImageBitmap(earthquakes);
}

function createMap(earthquakes) {
    // create base layers
    let baseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // create baseMaps object
    let baseMaps = {
        "Base Map": baselayer,
        "Topographic Map": topo
    };

    // create overlay object
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // create the map, with layers
    let fullMap = L.map("map", {
        center: [],
        zoom: 5,
        layers: [baselayer, earthquakes]
    });

    // create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(fullMap);
}

init();


/*
let map = L.map("map", {
    center: [-37.8136, 144.9631],
    zoom: 9
})

// tile provider



OpenStreetMap_Mapnik.addTo(map)

let marker = L.marker([-37.8136, 144.9631], {
    draggable: true,
    title: "marker"
})

marker.addTo(map)

L.circle([-37.8136, 144.9631],{
    color: "green",
    fillColor: "green",
    fillOpacity: 0.75,
    radius: 6000
}).addTo(map)

function markerSize(size){
    return Math.sqrt()
}

for (let i = 0; i < MediaCapabilities.length; i++) {
    L.circle(cities[i].location, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        radius : markerSize(cities[i].population)
    }).bindPopup(`<h1>${cities[i].name}</h1> <hr> <h3>Population: ${cities[i].population.toLocaleString()}</h3>`).addto(map);
}
*/