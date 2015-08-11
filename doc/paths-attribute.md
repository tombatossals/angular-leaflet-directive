'paths' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
<leaflet paths="paths"></leaflet>
```

It will map an object _paths_ of our controller scope with the corresponding object on our directive isolated scope. It's not a bidirectional relationship, so only the changes made in this object on the controller scope will affect the map vector paths rendering. Let's define the paths model with an example:

```
$scope.paths = {
    example: {
        type: "polyline",
        latlngs: [ { lat: 5, lng: 0.5 }, { lat: 7, lng: 0.7 }, { lat: 8, lng: 0.8 } ]
    }
}
```

We can see that the _path_ definition is conformed by object that will be drawn on our map. These object can be of different types, and everyone of them will have a _latlngs_ property which will define the path of the object to be drawn. In the example above, a polyline will be drawn with three main points.

Types of paths
--------------
We can define these types of paths:

* polyline.
* multiPolyline.
* polygon.
* multiPolygon.
* rectangle.
* circle.
* circleMarker.

Properties of paths
-------------------
We can change some of the properties of the paths (color, weight, opacity, stroke, etc.) the same way that we can change them on a Leaflet Path Object, take a look at [its documentation](http://leafletjs.com/reference.html#path) for reference.

Examples
--------
These three demos show the use of this functionality:
* [http://tombatossals.github.io/angular-leaflet-directive/examples/paths-simple-example.html](http://tombatossals.github.io/angular-leaflet-directive/examples/paths-simple-example.html)
* [http://tombatossals.github.io/angular-leaflet-directive/examples/paths-types-example.html](http://tombatossals.github.io/angular-leaflet-directive/examples/paths-types-example.html)
* [http://tombatossals.github.io/angular-leaflet-directive/examples/paths-example.html](http://tombatossals.github.io/angular-leaflet-directive/examples/paths-example.html)
