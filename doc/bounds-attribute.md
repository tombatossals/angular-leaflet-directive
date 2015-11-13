'bounds' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
<leaflet bounds="bounds" lf-center="center"></leaflet>
```

It will map an object _bounds_ of our controller scope with the corresponding object on our leaflet directive isolated scope. It's a bidirectional relationship, so a change in this object on the controller scope object will affect the map bounds, or an interaction on the map which changes the map position will update our _bounds_ values. Let's define the bounds model with an example:

```
$scope.bounds = {
    southWest: {
        lat:51.508742458803326,
        lng: -0.087890625,
    },
    northEast: {
        lat:51.508742458803326,
       lng:-0.087890625,
    }

}
```

Defining the bounds is a little complex, so we have a helper which will allow us to be more concise on the definition making use of and array with two arrays with to values inside (lat, lng). To use it, we must make use of the _leafletBoundsHelpers_ service on our controller. For example:

```
app.controller("DemoController", [ "$scope", "leafletBoundsHelpers", function($scope, leafletBoundsHelpers) {
    var bounds = leafletBoundsHelpers.createBoundsFromArray([
         [ 51.508742458803326, -0.087890625 ],
         [ 51.508742458803326, -0.087890625 ]
    ]);
    angular.extend($scope, {
        bounds: bounds
    });
});
```

And that's all, we can see how the _$scope.bounds_ object is updated when we are interacting with the map, like [this example](http://tombatossals.github.io/angular-leaflet-directive/examples/bounds-example.html).
