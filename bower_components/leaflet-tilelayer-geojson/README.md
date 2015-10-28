# Leaflet GeoJSON Tile Layer
Renders GeoJSON tiles on an L.GeoJSON layer.

## Docs

### Usage example
The following example shows how to render a GeoJSON Tile Layer for a tile endpoint at http://tile.example.com/{z}/{x}/{y}.json.

        var style = {
            "clickable": true,
            "color": "#00D",
            "fillColor": "#00D",
            "weight": 1.0,
            "opacity": 0.3,
            "fillOpacity": 0.2
        };
        var hoverStyle = {
            "fillOpacity": 0.5
        };

        var geojsonURL = 'http://tile.example.com/{z}/{x}/{y}.json';
        var geojsonTileLayer = new L.TileLayer.GeoJSON(geojsonURL, {
                clipTiles: true,
                unique: function (feature) {
                    return feature.id; 
                }
            }, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        var popupString = '<div class="popup">';
                        for (var k in feature.properties) {
                            var v = feature.properties[k];
                            popupString += k + ': ' + v + '<br />';
                        }
                        popupString += '</div>';
                        layer.bindPopup(popupString);
                    }
                    if (!(layer instanceof L.Point)) {
                        layer.on('mouseover', function () {
                            layer.setStyle(hoverStyle);
                        });
                        layer.on('mouseout', function () {
                            layer.setStyle(style);
                        });
                    }
                }
            }
        );
        map.addLayer(geojsonTileLayer);

### Constructor
    L.TileLayer.GeoJSON( <String> urlTemplate, <GeoJSONTileLayer options> options?, <GeoJSON options> geojsonOptions? )

### URL Template
A string of the following form, that returns valid GeoJSON.

    'http://{s}.somedomain.com/blabla/{z}/{x}/{y}.json'

### GeoJSONTileLayer options
* `clipTiles (boolean) (default = false)`: If `true`, clips tile feature geometries to their tile boundaries using SVG clipping.
* `unique (function)`: If set, the feature's are grouped into GeometryCollection GeoJSON objects. Each group is defined by the key returned by this function, with the feature object as the first argument.

### GeoJSON options
Options that will be passed to the resulting L.GeoJSON layer: [http://leafletjs.com/reference.html#geojson-options](http://leafletjs.com/reference.html#geojson-options)


## Contributors
Thanks to the following people who contributed:

* [Nelson Minar](https://github.com/NelsonMinar)
* [Alex Barth](https://github.com/lxbarth)
* [Pawel Paprota](https://github.com/ppawel)
* [Mick Thompson](https://github.com/dthompson)
