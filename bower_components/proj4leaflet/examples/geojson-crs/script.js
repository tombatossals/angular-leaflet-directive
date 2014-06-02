var map = L.map('map').setView([44.97,-93.24], 11);

// MapQuest OSM Tiles

// Attribution (https://gist.github.com/mourner/1804938)
var osmAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/"" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';

L.tileLayer(
  'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
  {
    subdomains: '1234',
    attribution: osmAttr + ', ' + mqTilesAttr
  }
).addTo(map);

// GeoJSON layer (UTM15)
proj4.defs('EPSG:26915', '+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs');

var geojson = {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [481650, 4980105],
  },
  'properties': {
    'name': 'University of Minnesota'
  },
  'crs': {
    'type': 'name',
    'properties': {
        'name': 'urn:ogc:def:crs:EPSG::26915'
      }
    }
  };

L.Proj.geoJson(geojson, {
  'pointToLayer': function(feature, latlng) {
    return L.marker(latlng).bindPopup(feature.properties.name);
  }
}).addTo(map);
