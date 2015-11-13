'lf-center' Documentation
================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
&lt;leaflet lf-center="center">&lt;/leaflet>
```

It will map an object _center_ of our controller scope with the corresponding object on our directive isolated scope. It's a bidirectional relationship, so a change in this object on the controller scope will affect the map center position, or an interaction on the map which changes the map center will update our _center_ values. Let's define the basic center model with an example:

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
&lt;leaflet lf-center="center">&lt;/leaflet>
```

And that's all. A full example of using this attribute can be found [here](http://tombatossals.github.io/angular-leaflet-directive/examples/0101-basic-center-example.html).

Let's see more properties we can use with the center sub-directive.

Autodiscover
------------
The _lat_, _lng_, and _center_ properties are mandatory to make the center work, but we have an optional property which we can use to auto-discover the position of the user browsing our page using the [W3C Geolocation API](http://dev.w3.org/geo/api/spec-source.html) using the corresponding methods defined on the [Leaflet API](http://leafletjs.com/reference.html#map-locate).

For example, we could show the user map position on start, or conditionally when he press a button. This property is defined like this:

```
angular.extend($scope, {
    center: {
        lat: 51.505,
        lng: -0.09,
        zoom: 4,
        autoDiscover: true
    }
});
```

We can see an example of how to use it [here](http://tombatossals.github.io/angular-leaflet-directive/examples/0102-basic-center-autodiscover-example.html).


Center position coded on a hash URL param
------------------------------------------
We can use a special feature of the center attribute which allow us to synchronize the center position of the map with a URL hash. This feature is inspired in the project [leaflet-hash](https://github.com/mlevans/leaflet-hash).

```
angular.extend($scope, {
    center: {
        lat: 51.505,
        lng: -0.09,
        zoom: 4,
        allowUrlHashCenter: true
    }
```

Adding the attribute _allowUrlHashCenter_ will synchronize the map center with a GET parameter on the URL of this form `?c=lat:lng:zoom`. Furthermore, whenever the map center is changed a new event `urlCenterHash` will be emitted to the parent scope so you can update your `$location.search` with the new info (if you want).

You can take a look of this feature on this [demo](http://tombatossals.github.io/angular-leaflet-directive/examples/0103-basic-center-url-hash-example.html).

More useful examples
--------------------
 * [center the map based in the IP of the client](http://tombatossals.github.io/angular-leaflet-directive/examples/0109-basic-center-geoip-example.html).
