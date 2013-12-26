'maxBounds' Attribute Documentation
===================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet maxBounds="maxBounds"></leaflet>
```

It will map an object _maxBounds_ of our controller scope with the corresponding object on our leaflet directive isolated scope. It's not a bidirectional relationship, only the changes made to our _maxBounds_ object on the controller scope will affect the map, but no viceversa.

```
$scope.maxBounds = {
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
    var maxBounds = leafletBoundsHelpers.createBoundsFromArray([
         [ 51.508742458803326, -0.087890625 ],
         [ 51.508742458803326, -0.087890625 ]
    ]);
    angular.extend($scope, {
        maxBounds: maxBounds
    });
});
```

And that's all, we can see how the map is affected when we change the _maxBounds_ scope values, like [this example](http://tombatossals.github.io/angular-leaflet-directive/examples/maxbounds-example.html).
