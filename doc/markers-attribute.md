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

The _markers_ definition is composed by a group of named objects (markers) every one of them with a set of attributes that we are going to describe below. When we associate that object with our _leaflet-directive_ the bidirectional relation will start, and the markers defined will be will be shown on the map.

Marker attributes
-----------------
Every marker can have these properties:

* **lat**. Number. Latitude.
* **lng**. Number. Longitude.
* **focus**. true/false. Shows/hide the popup of the marker (only one can be active).
* **message**. String. Message to show on the popup.
* **draggable**. true/false. Make the marker draggable.

There are a special type of property called _label_ which uses the [Leaflet.label plugin ](https://github.com/Leaflet/Leaflet.label) to show a special label on hover the marker. These are the properties we need to define to use it:

```
label: {
    message: "Hey, drag me if you want",
    options: {
        noHide: true
    }
}
```
