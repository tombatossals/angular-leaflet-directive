'layers' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
<leaflet layers="layers"></leaflet>
```

It will map an object _layers_ of our controller scope with the corresponding object on our directive isolated scope. It's not a bidirectional relationship, so only the changes made in this object on the controller scope will affect the layers definition in
our leaflet map. Let's define the layers model with an example:

```
$scope.layers = {
    baselayers: {
        osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
        },
        cloudmade: {
            name: 'Cloudmade Tourist',
            type: 'xyz',
            url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
            layerParams: {
                key: '007b9471b4c74da4a6ec7ff43552b16f',
                styleId: 7
            }
        }
    }
}
```

We can see that the _layers_ definition is conformed by lot attributes that we are going to describe below. When we associate that object with our _leaflet-directive_ the unidirectional relation will start, and the first layer will be shown on the map and a new layer-switcher-control will appear on our map.

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
* GeoJSON Layer.
