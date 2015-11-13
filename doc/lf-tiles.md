'lf-tiles' Documentation
========================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
&lt;leaflet lf-tiles="tiles">&lt;/leaflet>
```

We will use this object to set the basic tiles of our map. If you need more complex functionality you need to take a look at the _lf-layers_ sub-directive. It's not a bi-directional object. Changes to the scope object will affect the map tiles rendered on screen.

Take a look first at the [leaflet tilelayer API call](http://leafletjs.com/reference.html#tilelayer) if you don't know nothing about it, but let's see its basic properties.

```
$scope.tiles = {
    url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
    options: {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
}
```

The options passed to this object can be set with a lot of attributes, and are the same passed to the leaflet tile object, documented [here](http://leafletjs.com/reference.html#tilelayer-options).

And that's all, we can see how the map is affected when we change the _tiles_ scope object values in these examples:

* [Tiles basic example](http://tombatossals.github.io/angular-leaflet-directive/examples/0107-basic-tiles-example.html).
* [Change tiles with zoom example](http://tombatossals.github.io/angular-leaflet-directive/examples/0108-basic-tiles-zoom-changer-example.html).
