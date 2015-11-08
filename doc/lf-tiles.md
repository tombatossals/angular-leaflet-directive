'tiles' Attribute Documentation
===================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
<leaflet tiles="tiles"></leaflet>
```

It will map an object _tiles_ of our controller scope with the corresponding object on our leaflet directive isolated scope. It's not a bidirectional relationship, only the changes made to our _tiles_ object on the controller scope will affect the map, but no vice versa.

This object is basically composed of two attributes: **url** and **options**. Let's see them in an example definition:
```
$scope.tiles = {
    url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
    options: {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
}
```

The options passed to this object could have a lot of attributes, and are the same passed to the leaflet tile object, documented [here](http://leafletjs.com/reference.html#tilelayer-options).


And that's all, we can see how the map is affected when we change the _tiles_ scope object values, like these examples:

* [tiles-example.html](http://tombatossals.github.io/angular-leaflet-directive/examples/tiles-example.html).
* [tiles-zoom-changer-example.html](http://tombatossals.github.io/angular-leaflet-directive/examples/tiles-zoom-changer-example.html).
