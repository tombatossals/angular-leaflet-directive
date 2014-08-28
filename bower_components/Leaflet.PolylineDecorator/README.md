# Leaflet PolylineDecorator

A Leaflet plug-in to define and draw patterns on existing Polylines or along coordinate paths.

## Compatibility with Leaflet versions

The development version of the plugin (on the `master` branch) is now targeted at the dev version of Leaflet (0.8), which includes some API breaking changes.

For a version of the plugin compatible with the latest stable Leaflet release, use the `leaflet-0.7.2` branch.

## Features

* Dashed or dotted lines, arrow heads, markers following line
* Works on Polygons too! (easy, as Polygon extends Polyline)
* Multiple patterns can be applied to the same line
* New behaviors can be obtained by defining new symbols

## Usage

```javascript
    var polyline = L.polyline([...]).addTo(map);
    var decorator = L.polylineDecorator(polyline, {
        patterns: [
            // define a pattern of 10px-wide dashes, repeated every 20px on the line 
            {offset: 0, repeat: '20px', symbol: new L.Symbol.Dash({pixelSize: 10})}
        ]
    }).addTo(map);
```

The `polyline` parameter can be a single array of `L.LatLng` or, with Leaflet's simplified syntax, an array of 2-cells arrays of coordinates. 
It is useful if you don't want to actually display a polyline, but just a pattern following coordinates, like a dotted line.

## Screenshot

![screenshot](https://raw.github.com/bbecquet/Leaflet.PolylineDecorator/master/screenshot.png "Screenshot showing different applications of the library")

## Performance note

Please note that this library is in an early stage, and many operations could still be optimized.
Moreover, as it requires a lot of (re-)computations, and each pattern symbol is an actual `L.ILayer` object, it can have an impact on the responsiveness of your map, especially if used on many objects.
In cases where it's applicable (dash patterns), you should probably use instead the `dashArray` property of `L.Path`, as it's natively drawn by the browser.

## TODO

* Documentation
* Optimize rendering and mem footprint
* Other symbol types
* Animations(?)

