# ambiguity

This repo contains two scripts.

### generate-geofence-from-circles.js
Accepts as input a list of circular areas described by center coordinates plus the radius.
Saves two .geojson files: the first contains a collection of features where all the circumferences are approximated into polygons, the second merge all the figures into a singular polygon.

### check-coords-against-georeference.js
Accepts as input a geojson polygon and a list of points described by lat and lon coordinates in json format (see comments inside the file for more details). It outputs the same list with a new property flagged 'true' if the point falls within the polygon, 'false' if not.