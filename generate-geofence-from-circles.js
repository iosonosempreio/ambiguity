// This script accepts a list of centers coordinates and radiuses as inputs
// and create a collection of polygons approximating the circular shape
// and save them into a geojson file.

const fs = require('fs');
const turf = require('@turf/turf');
const d3 = require('d3');

let fences = fs.readFileSync('./input/circles-KBHK.csv')
    .toString();

fences = d3.csvParse(fences);

let collection = {
  "type": "FeatureCollection",
  "features": []
  }

fences.forEach(function(d, i) {

    let center = [+d.lon, +d.lat];
    let radius = +d.radius / 1000;
    let thisCircle = turf.circle(center, radius);

    collection.features.push(thisCircle);
})

fs.writeFileSync('./output/circles-separated-KBHK.geojson', JSON.stringify(collection));
console.log('geometries saved');

let fullFence = turf.union(collection.features[0], collection.features[1]);
collection.features.forEach(function(d, i) {
    fullFence = turf.union(fullFence, collection.features[i]);
});

fs.writeFileSync('./output/geofence-polygon-KBHK.geojson', JSON.stringify(fullFence));
console.log('geofence polygon saved');

