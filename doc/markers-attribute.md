'markers' Attribute Documentation
=================================

This sub-directive needs the **leaflet** main directive, so it is normally used as an attribute of the *leaflet* tag, like this:

```
<leaflet markers="markers"></leaflet>
```

It will map an object _markers_ of our controller scope with the corresponding object on our directive isolated scope. It's a bidirectional relationship, so changes made in this object on the controller scope will affect the markers of our leaflet map.
Let's define the markers model with an example:

```
$scope.markers = {
    main: {
        lat: 51,
        lng: 0,
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
* **message**. String. Message to show on the popup. Can be an Angular template.
* **getMessageScope**. Function. A function that returns the scope on which the message will be compiled. Defaults to $rootScope if not specified.
* **compileMessage**. true/false. Deactivate the Angular compilation of the message. Defaults to true if unspecified.
* **draggable**. true/false. Make the marker draggable.
* **popupOptions**. Options object passed to the leaflet popup. You can see [here](http://leafletjs.com/reference.html#popup-options) its properties.
* **enable**. Array of Strings. Only events listed in this property will be watched and converted to angular events. Format for the angular event name: `leafletDirectiveMarker.event_name`.
* **disable**. Array of Strings. All leaflet marker events, except the one listed in this property, will be watched and converted to angular events. This will overwrite **enable** property.
* **icon**. We can set the type of icon to be shown on our marker with this property. We can define the same properties of this property on leaflet ([documented here](http://leafletjs.com/reference.html#icon)), and furthermore we can define a special type of icon _awesomeMarker_, which makes use of the [Awesome Markers project](https://github.com/lvoogdt/Leaflet.awesome-markers) to customize the icon based on the _icon_ and _markerColor_ properties. Let's see some examples:

```
marker: {
    lat: 51.505,
    lng: -0.09,
    icon: {
        iconUrl: 'img/leaf-orange.png',
        shadowUrl: 'img/leaf-shadow.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62]
    }
}
```

```
marker: {
    lat: 51.505,
    lng: -0.09,
    icon: {
        type: 'awesomeMarker',
        icon: 'tag',
        markerColor: 'red'
    }
}
```

We can see an example using all this [here](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-update-example.html).


There are a special type of property called _label_ which uses the [Leaflet.label plugin ](https://github.com/Leaflet/Leaflet.label) to show a fixed special label on the marker, or on hovering it. This is the marker property we need to define to use it:

```
label: {
    message: "Hey, drag me if you want",
    options: {
        noHide: true
    }
}
```

You can see an example of this special label [here](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-label-example.html).


The **message** property of a marker can contain an Angular template. This is supported for labels also. You can control the scope used to compile this message with the **getMessageScope** property. When defined, it must be a function that returns the wanted scope. You can disable the angular compilation process by specifying compileMessage: false. By default compilation is activated, including if not specified.

You can see an example of Angular content in messages [here](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-angular-template-example.html).


Markers watches
---------------
Every marker you add to the map is watched for changes by default, so a change in a marker property will be reflected on the map directly. This feature can be disabled if you don't need to dynamic modification of markers and prefer better performance. This is the command used to disable markers watchers:

```
<leaflet markers="markers" watch-markers="false"></leaflet>
```

By default the markers will be watched, so we can change its properties dynamically, like in [this demo](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-update-example.html).


Markers inside overlays
-----------------------
We can group the markers inside a layer overlay, so the layer switch selector control will appear and we could activate/deactivate overlays with their markers.

Let's see an example of this feature on [this demo](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-groups-example.html).

This special rendering can be accomplished defining overlays of type _group_ and with _name_ property, and the markers will need a special property _layer_ with the name of the overlay we've previously defined.

Marker clustering without overlays
----------------------------------
We can use the [marker clustering plugin](https://github.com/Leaflet/Leaflet.markercluster) of Leaflet to group our markers depending of the zoom we're using. This can be accomplished by simply setting the _type_ property of the marker to the value _group_. Example:

```
markers: {
    battersea: {
        group: 'london',
        lat: 51.4638,
        lng: -0.1677
    },
    stoke: {
        group: 'london',
        lat: 51.5615,
        lng: -0.0731
    }
```

You can see an example running this [here](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-without-overlays-example.html)

Marker clustering with overlays
-------------------------------
We can mix the overlays functionality with the marker clustering, grouping our markers by overlays. See this example:

```
layers: {
    baselayers: { ... },
    overlays: {
        northTaiwan: {
            name: "North cities",
            type: "markercluster",
            visible: true
        }
    }
}

markers: {
    taipei: {
        layer: "northTaiwan",
        lat: 25.0391667,
        lng: 121.525,
    },
    yangmei: {
        layer: "northTaiwan",
        lat: 24.9166667,
        lng: 121.1333333
    },
    hsinchu: {
        layer: "northTaiwan",
        lat: 24.8047222,
        lng: 120.9713889
    },
```

You can see the complete example [here](http://tombatossals.github.io/angular-leaflet-directive/examples/markers-clustering-example.html)
