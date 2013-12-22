'Center' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet center="center"></leaflet>
```

It will map an object _center_ of our controller scope with the corresponding object on our directive isolated scope. It's a bidirectional relationship, so a change in this object on the controller scope will affect the map center position, or an interaction on the map wich changes the map center will update our _center_ values. Let's define the center model with an example:

```
$scope.center = {
    lat: 51.505,
    lng: -0.09,
    zoom: 4
}
```

We can see that a center is conformed by three attributes: _lat_, _lng_ and _zoom_. When we associate that object with our _leaflet-directive_ the bi-directional relation will start.


Let's see a complete example of how to use this. We must create a center object in our controller, pass its name to our directive _center_ attribute, an that's all.

```
angular.extend($scope, {
    center: {
        lat: 51.505,
        lng: -0.09,
        zoom: 4
    }
});
```

And after that, in our HTML code we will define our leaflet directive like this:
```
<leaflet center="center"></leaflet>
```

And that's all. A full example of using this attribute can be found [here](http://tombatossals.github.io/angular-leaflet-directive/examples/center-example.html).
