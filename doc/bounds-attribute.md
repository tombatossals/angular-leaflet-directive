'Bounds' Attribute Documentation
==================================

This sub-directive needs the **leaflet** main directive, so it is normaly used as an attribute of the *leaflet* tag, like this:

```
<leaflet bounds="bounds"></leaflet>
```

It will map an object _bounds_ of our controller scope with the corresponding object on our leaflet directive isolated scope. It's a bidirectional relationship, so a change in this object on the controller scope object will affect the map bounds, or an interaction on the map which changes the map center will update our _bounds_ values. Let's define the bounds model with an example:

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

