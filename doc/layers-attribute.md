'layers' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet layers="layers"></leaflet>
```

It will map an object _layers_ of our controller scope with the corresponding object on our directive isolated scope. It's not a bidirectional relationship, so only the changes made in this object on the controller scope will affect the map center position. Let's define the layers model with an example:

```
$scope.layers = {
    layers: {
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
}
```

We can see that the _layers_ definition is conformed by lot attributes that we are going to describe belo. When we associate that object with our _leaflet-directive_ the unidirectional relation will start, and the first layer will be shown on the map and a new layer-switcher-control will appear on our map.
