'markers' Attribute Documentation
=================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet markers="markers"></leaflet>
```

It will map an object _markers_ of our controller scope with the corresponding object on our directive isolated scope. It's a bidirectional relationship, so changes made in this object on the controller scope will affect the markers of our leaflet map.
Let's define the markers model with an example:

```
$scope.markers = {
    main: {
        lat: 51,
        lng. 0,
        focus: true,
        message: "This place is in London",
        draggable: true
    }
}
```

Look at [this first example](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-simple-example.html).

The _markers_ definition is composed by a group of named objects with a lot of attributes that we are going to describe below. When we associate that object with our _leaflet-directive_ the bidirectional relation will start, and the markers defined will be will be shown on the map.

The layer-switcher-control will only appear if there are more than one layer (baselayer or overlay) that could be changed interactively by the user, if there's only one layer, no control will be visible.

BaseLayers are the main tiles shown in the map, they could be interactively changed by the user on the switch control if more than one is visible, but only one can be active at the time (input radio buttons on the control). Overlays are tiles that can be shown on the map overlapped to the main baselayer (normally they use transparency) and more than one can be active at the time (input checkbox buttons). More about these types of layers [here](http://leafletjs.com/reference.html#control-layers).

* [Baselayer simple demo](http://tombatossals.github.io/angular-leaflet-directive/examples/layers-simple-example.html).
* [Overlays simple demo](http://tombatossals.github.io/angular-leaflet-directive/examples/overlays-simple-example.html).

Types of layers
---------------
We are not limited to one type of layers, we can define other types:

* XYZ Layer.
* WMS Layer.
* WFS Layer.
* GoogleMaps Layer.
* MarkerCluster Layer.
