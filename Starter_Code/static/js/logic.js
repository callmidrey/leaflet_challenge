// Import the dataset and Store the URL for the earthquake data
var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL using D3
d3.json(Url).then(function(data) {
    createFeatures(data.features);
}).catch(function(error) {
    console.log("Error loading data: " + error);
});

// Create features Functions (earthquake markers)
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        // Create layers gathering the coordinates
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.6,
                color: "#000",
                stroke: true,
                weight: 0.8
            });
        }
    });

    // Generate the map layers
    createMap(earthquakes);
}

// Generate the map layers
function createMap(earthquakes) {
    // Generate the base of the map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Generate a baseMaps object to hold streetmap layer.
    let baseMaps = {
        "Street Map": streetmap
    };
    // Generate an overlayMaps object to hold earthquakes layer.
    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Generate map object with options.
    let map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Make legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        let div = L.DomUtil.create('div', "legend"),
            depths = [0, 1, 10, 30, 50, 70],
            labels = [];

        // Create a loop through the groups and generate colored labels for each group
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add legend to map
    legend.addTo(map);
}

// Assign color of the marker based on earthquake depth
function getColor(depth) {
    return depth > 70 ? "#238823" :
        depth > 50 ? "#6fa06f" :
        depth > 30 ? "#98bf98" :
        depth > 10 ? "#c2e699" :
        depth > 1 ? "#e5f5e0" :
        "#f7fcf5";
}

// Determine the radius of the marker based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 25;
}

