# Leaflet.MakiMarkers

[Leaflet](http://www.leafletjs.com) plugin to create map icons using [Maki Icons](https://www.mapbox.com/maki/) from MapBox. Markers are retrieved from MapBox's [Static Marker API](https://www.mapbox.com/developers/api/static/#markers).

[![Screenshot](https://raw.github.com/jseppi/Leaflet.MakiMarkers/master/images/screenshot.png "Screenshot of MakiMarkers")](http://jsfiddle.net/Zhzvp/)

## Usage

Simply include `Leaflet.MakiMarkers.js` in your page after you include `Leaflet.js`: `<script src="Leaflet.MakiMarkers.js"></script>`

```js
// Specify a Maki icon name, hex color, and size (s, m, or l).
// An array of icon names can be found in L.MakiMarkers.icons or at https://www.mapbox.com/maki/
// Lowercase letters a-z and digits 0-9 can also be used. A value of null will result in no icon.
// Color may also be set to null, which will result in a gray marker.
var icon = L.MakiMarkers.icon({icon: "rocket", color: "#b0b", size: "m"});
L.marker([30.287, -97.72], {icon: icon}).addTo(map);
```

[JSFiddle Demo](http://jsfiddle.net/Zhzvp/26/)

## Requirements

[Leaflet](http://www.leafletjs.com) 0.5+

## Thanks

Thanks to [MapBox](http://www.mapbox.com) for making their Marker API available and for the Maki icon set.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jseppi/leaflet.makimarkers/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

