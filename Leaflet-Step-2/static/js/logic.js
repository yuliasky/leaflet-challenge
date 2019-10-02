var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var tectonicLinesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Calls function

PlotMap(earthquakeURL, tectonicLinesURL);

function PlotMap(earthquakeURL, tectonicLinesURL){
//Getting both URL data and saved in variables
    d3.json(earthquakeURL,function(data){
        console.log(earthquakeURL)
        var earthData = data;
    d3.json(tectonicLinesURL,function(data){
        console.log(tectonicLinesURL)
        var tectonicLinesData = data;
    
    //go to createFeatures function
    createFeatures(earthData.features,tectonicLinesData.features);
    });
});

    function createFeatures(earthData,tectonicLinesData){
        //Your data markers should reflect the magnitude of the earthquake in their size and color. 
        //Earthquakes with higher magnitudes should appear larger and darker in color.
        function onEachEarthSize(feature, layer){
            return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
                fillOpacity:0.6,
                color:chooseColor(feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            });
            console.log(chooseColor)
        };
        //Include popups that provide additional information about the earthquake when a marker is clicked
        function onEachEarthpop(feature,layer){
            layer.bindPopup("<h5>" + feature.properties.title +"</h5><h3> Magnitude: "+feature.properties.mag + " </h3><p>" + new Date(feature.properties.time) + "</p>");
        }
         // Defines a function that is run once for each feature in faultLineData
        function onEachLine(feature, layer) {
            L.polyline(feature.geometry.coordinates);
          }

        var earthquakes = L.geoJSON(earthData, {
            onEachFeature: onEachEarthpop,
            pointToLayer: onEachEarthSize
            
          });    
        var faultLines = L.geoJSON(tectonicLinesData, {
            onEachFeature: onEachLine,
            style: {
              weight: 2,
              color: 'orange'
            }
          });
    // Sends earthquakes, faultLines to the createMap function
    createMap(earthquakes, faultLines);
    }

    function createMap(earthquakes, faultLines) {
    // Define outdoors, satellite, and darkmap layers   
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        // maxZoom: 3,
        id: "mapbox.streets",
        accessToken: API_KEY
      });
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        //maxZoom: 3,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //maxZoom: 3,
    id: "mapbox.dark",
    accessToken: API_KEY
    });
    // Define a baseMaps object to hold base layers
    var baseMaps = {
        "Satellite": satellitemap,
        "Grayscale": darkmap,
        "Outdoors": streetmap
    };
    
    // Create overlay object to hold overlay layers
    var overlayMaps = {
        "Fault Lines": faultLines,
        "Earthquakes": earthquakes
    };

        // Create map, default settings: outdoors and faultLines layers display on load
    var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [satellitemap, earthquakes, faultLines]
    });
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
    }).addTo(map);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    grades = [0, 1, 2, 3, 4, 5],
    labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + chooseColor(grades[i]+1) + '"></i> ' +
                labels[i]+ '<br>';
      }
    return div;
    };
    legend.addTo(map);
    }
}
    // chooseColor function:

function chooseColor(magnitude) {
    
        if (magnitude>5){
            return "red";}
        else if (magnitude>4){
            return "orange"}
        else if (magnitude>3){
            return "gold"}
        else if (magnitude>2){
            return "yellow"}
        else if (magnitude>1){
            return "yellowgreen"}
        else {
            return "greenyellow";}
    }

//function markerSize
function markerSize(magnitude) {
    return magnitude * 3;
}