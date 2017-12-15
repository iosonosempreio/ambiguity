// This script is meant for checking a list of coordinates against a geofence.
// It returns a true value if the point is inside of the area.
// It outputs a JSON file, use rawgraphs if you want to easily convert it
// into a tabular format

const fs = require('fs');
const turf = require('@turf/turf');
const d3 = require('d3');

let fences = fs.readFileSync('./input/circles-KBHK.csv').toString();
fences = d3.csvParse(fences);

// calulate geometries for geofences
let circles = [];
let fullFence = [];

fences.forEach(function(d, i) {

    // in geojson longitudes always come before latitudes
    let center = [+d.lon, +d.lat];
    let radius = +d.radius / 1000;
    let thisCircle = turf.circle(center, radius);

    circles.push(thisCircle);
})

fullFence = turf.union(circles[0], circles[1]);
circles.forEach(function(d, i) {
    fullFence = turf.union(fullFence, circles[i]);
});


// load the list of places to check against the geofence
// the list must have a similar structure:
// {
//     "id": "219533054725933",
//     "location":
//     {
//         "longitude": 12.582954491272,
//         "city": "København",
//         "country": "Denmark",
//         "latitude": 55.67930541456
//     },
//     "name": "KØBENHAVN - Kopenhagen -"
// }
let places = fs.readFileSync('./input/places_KBHK.json').toString();

places = JSON.parse(places);

places.forEach(function(d) {
    let thisPoint = [d.location.longitude, d.location.latitude];
    thisPoint = turf.point(thisPoint);
    d.insideFence = turf.booleanContains(fullFence, thisPoint);
});

//Flat on a single level object
places = places.map(function(d) {
    return {
        "id": d.id,
        "latitude": d.location.latitude,
        "longitude": d.location.longitude,
        "city": d.location.city,
        "country": d.location.country,
        "name": d.name,
        "insideFence": d.insideFence
    }
})

fs.writeFileSync('./output/places-checked-KBHK.json', JSON.stringify(places));