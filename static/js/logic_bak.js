// initialise map

let map = L.map("map", {
    center: [-37.8136, 144.9631],
    zoom: 9
})

// tile provider

var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

OpenStreetMap_Mapnik.addTo(map)

let marker = L.marker([-37.8136, 144.9631], {
    draggable: true,
    title: "marker"
})

marker.addTo(map)

L.circle([-37.8136, 144.9631], {
    color: "green",
    fillColor: "green",
    fillOpacity: 0.75,
    radius: 6000
}).addTo(map)

function markerSize(size) {
    return Math.sqrt()
}

for (let i = 0; i < MediaCapabilities.length; i++) {
    L.circle(cities[i].location, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        radius: markerSize(cities[i].population)
    }).bindPopup(`<h1>${cities[i].name}</h1> <hr> <h3>Population: ${cities[i].population.toLocaleString()}</h3>`).addto(map);
}