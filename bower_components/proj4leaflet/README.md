Proj4Leaflet [![NPM version](https://badge.fury.io/js/proj4leaflet.png)](http://badge.fury.io/js/proj4leaflet)
============

This [Leaflet](http://leafletjs.com) plugin adds support for using projections supported by
[Proj4js](https://github.com/proj4js/proj4js).

## Features

* Use tiles in any projection supported by Proj4js
* Use GeoJSON in CRSs' other than WGS84

Leaflet comes with built in support for tiles in [Spherical Mercator](http://wiki.openstreetmap.org/wiki/EPSG:3857). If you need support for tile layers in other projections, the Proj4Leaflet plugin lets you use tiles in any projection supported by Proj4js, which means support for just about any projection commonly used.

Proj4Leaflet also adds support for GeoJSON in any projection, while Leaflet by itself assumes GeoJSON to always use WGS84 as its projection.

For more details, see [tiling and projections](http://blog.kartena.se/local-projections-in-a-world-of-spherical-mercator/).

## Usage

Common use means making a new CRS instance for the projection you want to use.

```javascript
// RT90 with map's pixel origin at RT90 coordinate (0, 0)
var crs = new L.Proj.CRS('EPSG:2400',
  '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
  '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
  '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
  {
    resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
  }
);

var map = L.map('map', {
  crs: crs,
  continuousWorld: true,
  worldCopyJump: false
});
L.tileLayer('http://tile.example.com/example/{z}/{x}/{y}.png').addTo(map);
```

Using options when constructing the CRS, you can set the tile set's origin:
```javascript
// SWEREF 99 TM with map's pixel origin at (218128.7031, 6126002.9379)
var crs = new L.Proj.CRS('EPSG:3006',
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  {
    origin: [218128.7031, 6126002.9379],
    resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
  }
);
```

To use a [TMS](http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification) tile server, you must use a the class ```L.Proj.CRS.TMS``` as your CRS. Also, the ```tms``` option must be set on the L.TileLayer instance.
```javascript
// EPSG:102012 served by TMS with bounds (-5401501.0, 4065283.0, 4402101.0, 39905283.0)
new L.Proj.CRS.TMS('EPSG:102012',
    '+proj=lcc +lat_1=30 +lat_2=62 +lat_0=0 +lon_0=105 +x_0=0 +y_0=0 '
    + '+ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    [-5401501.0, 4065283.0, 4402101.0, 39905283.0],
    {
        resolutions: [
           140000.0000000000,
            70000.0000000000,
            35000.0000000000,
            17500.0000000000
        ]
    }
);

...

L.tileLayer('http://tile.example.com/example/{z}/{x}/{y}.png', {tms: true}).addTo(map);
```

(See reference for [L.CRS.TMS](#lprojcrstms) for details on TMS and Leaflet versions before 0.7.)

## Proj4js compatibility notice
Proj4js has breaking changes introduced after version 1.1.0. The current version of Proj4Leaflet
uses Proj4js 1.3.4 or later. If you for some reason need Proj4js version 1.1.0 compatibility, you can
still use Proj4Leaflet [version 0.5](https://github.com/kartena/Proj4Leaflet/tree/0.5).

## API
The plugin extends Leaflet with a few classes that helps integrating Proj4's projections into
Leaflet's [ICRS](http://leafletjs.com/reference.html#icrs) interface.

###L.Proj.CRS
An ICRS implementation that uses a Proj4 definition for the projection. This is likely to be the only class you need to work with in Proj4Leaflet.

####Usage example
```javascript
var map = L.map('map', {
    center: [57.74, 11.94],
    zoom: 13,
    crs: L.Proj.CRS('EPSG:2400',
      '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
      '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
      '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
      {
        resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
      });
    continuousWorld: true,
    worldCopyJump: false
});
```

####Constructor
```javascript
L.Proj.CRS(code, proj4def, options)
```

* ```code``` is the projection's SRS code (only used internally by the Proj4js library).
* ```proj4def``` is the Proj4 definition for the projection to use
* ```options``` is an options object with these possible options:
  * ```origin```: the projected coordinate to use as the map's pixel origin; overrides the
    ```transformation``` option if set
  * ```transformation```: an [L.Transformation](http://leafletjs.com/reference.html#transformation) that is used to transform the projected coordinates to pixel coordinates; default is ```L.Transformation(1, 0, -1, 0)```
  * ```scales```: an array of scales (pixels per projected coordinate unit) for each corresponding zoom level; default is to use Leaflet's native scales. You should use ```scales``` _or_ ```resolutions```, not both.
  * ```resolutions```: an array of resolutions (projected coordinate units per pixel) for each corresponding zoom level; default is to use Leaflet's native resolutions. You should use ```scales``` _or_ ```resolutions```, not both.
  * ```bounds```: An [L.bounds](http://leafletjs.com/reference.html#bounds) providing the bounds of CRS in projected coordinates. If defined, Proj4Leaflet will use this in the ```getSize``` method, otherwise reverting to Leaflet's default size for spherical Mercator.

###L.Proj.CRS.TMS
ICRS implementation to work with a Proj4 projection that will be used together with a [TMS](http://en.wikipedia.org/wiki/Tile_Map_Service) tile server. Since TMS has its y axis in the opposite direction of Leaflet (and OpenStreetMap/Google Maps), this requires some extra work.

_Note_: If you use TMS and Leaflet _before_ version 0.7, you _must_ use ```L.Proj.TileLayerTMS``` instead of a standard L.TileLayer; the standard TileLayer before 0.7 couldn't handle other projections than spherical Mercator together with TMS.

####Usage example
```javascript
var map = new L.Map('map', {
    crs: new L.Proj.CRS.TMS('EPSG:102012',
        '+proj=lcc +lat_1=30 +lat_2=62 +lat_0=0 +lon_0=105 +x_0=0 +y_0=0 '
        + '+ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        [-5401501.0, 4065283.0, 4402101.0, 39905283.0],
        {
            resolutions: [
               140000.0000000000,
                70000.0000000000,
                35000.0000000000,
                17500.0000000000
            ]
        }
    ),
    continuousWorld: true,
    worldCopyJump: false
});
```

####Constructor
```javascript
L.Proj.CRS.TMS(code, proj4def, projectedBounds, options)
```

* ```code``` is the projection's SRS code (only used internally by the Proj4js library).
* ```proj4def``` is the Proj4 definition for the projection to use
* ```projectedBounds``` the bounds of the TMS tile grid in projected coordinates. The bounds need to be properly specified and align to the grid on all provided zoom levels, or markers and/or tiles will not align properly with the corresponding WGS84 coordinate.
* ```options``` is an options object with the same keys as ```L.Proj.CRS```. It also accepts one extra option:
  * ```tileSize```: sets the tile size (in pixels) which the CRS should align to; in case the projected bounds do not align with the tile grid, CRS will align it using this tile size. Default is 256.

###L.Proj.TileLayer.TMS
*Deprecated since version 0.7, since Leaflet 0.7 does not need this class.*

Extends [L.TileLayer](http://leafletjs.com/reference.html#tilelayer) to support TMS when working with Proj4 projections. Note that for Leaflet versions before 0.7, ```L.TileLayer``` will _not_ work with other projections than
EPSG:3857 if the option ```tms``` is enabled.

####Usage example
```javascript
var crs = new L.Proj.CRS.TMS(...),
    map = new L.Map('map', {
        crs: crs,
        continuousWorld: true,
        worldCopyJump: false
    }),

map.addLayer(new L.Proj.TileLayer.TMS('http://{s}.my-tms-server/{z}/{x}/{y}.png', crs, {
    maxZoom: 17
    ,minZoom: 0
    ,continuousWorld: true
    ,attribution: attrib
}));
```

####Constructor
```javascript
L.Proj.TileLayer.TMS(tileUrl, crs, options)
```

* ```tileUrl``` is the URL template to use for tiles (see [L.TileLayer](http://leafletjs.com/reference.html#tilelayer))
* ```crs``` is the L.Proj.CRS.TMS ICRS object used for this layer
* ```options``` are the options for this layer, see [L.TileLayer](http://leafletjs.com/reference.html#tilelayer)

###L.Proj.GeoJSON

Extends [L.GeoJSON](http://leafletjs.com/reference.html#geojson) to add CRS support.  Unlike the TileLayer extension, the CRS
 is derived from the `name` property of a `crs` defined directly on the GeoJSON object per [the spec](http://www.geojson.org/geojson-spec.html#named-crs).  Linked CRSs are not supported.

**Note:** The relevant Proj4 definition should be defined directly via `proj4.defs` before loading the GeoJSON object.  If it is not, proj4leaflet will throw an error.


####Usage Example
```javascript
proj4.defs("urn:ogc:def:crs:EPSG::26915", "+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs");
var geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [481650, 4980105]
  },
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::26915"
    }
  }
};
var map = L.map('map');
// ...
L.Proj.geoJson(geojson).addTo(map);
```

###L.Proj.ImageOverlay

Works like [L.ImageOverlay](http://leafletjs.com/reference.html#imageoverlay), but accepts bounds in the map's
projected coordinate system instead of latitudes and longitudes. This is useful when the projected coordinate systems
axis do not align with the latitude and longitudes, which results in distortion with the default image overlay in Leaflet.

####Usage Example
```javascript
// Coordinate system is EPSG:28992 / Amersfoort / RD New
var imageBounds = L.bounds(
  [145323.20011251318, 475418.56045463786],
  [175428.80013969325, 499072.9604685671]);
L.Proj.imageOverlay('http://geo.flevoland.nl/arcgis/rest/services/Groen_Natuur/Agrarische_Natuur/MapServer/export?format=png24&transparent=true&f=image&bboxSR=28992&imageSR=28992&layers=show%3A0&bbox=145323.20011251318%2C475418.56045463786%2C175428.80013969325%2C499072.9604685671&size=560%2C440',
  imageBounds);
```
