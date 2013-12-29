Leaflet.label
=============

**NOTE: lastest Leaflet.label master requires Leaflet 0.7-dev**

Leaflet.label is plugin for adding labels to markers &amp; shapes on leaflet powered maps.

Check out the [demo](http://leaflet.github.com/Leaflet.label/).

##Usage examples

If you want to just bind a label to marker that will show when the mouse is over it, it's really easy:

````js
L.marker([-37.7772, 175.2606]).bindLabel('Look revealing label!').addTo(map);
````

Path overlays works the same:

````js
L.polyline([
	[-37.7612, 175.2756],
	[-37.7702, 175.2796],
	[-37.7802, 175.2750],
]).bindLabel('Even polylines can have labels.').addTo(map)	
````

If you would prefer the label to be always visible set the ````noHide: true```` option and call ````showLabel()```` once added to the map:

````js
L.marker([-37.785, 175.263])
	.bindLabel('A sweet static label!', { noHide: true })
	.addTo(map);
````

##Options

When you call ````bindLabel()```` you can pass in an options object. These options are:

 - **noHide**: doesn't attach event handler for showing/hiding the label on mouseover/out.
 - **className**: the css class to add to the label element
 - **direction**: one of `left`|`right`(default)|`auto`. The direction the label displays in relation to the marker. `auto` will choose the optimal direction depending on the position of the marker.

E.g. To create a static label that automatically positions the label

````js
var myIcon = L.icon({
	iconUrl: 'my-icon.png',
	iconSize: [20, 20],
	iconAnchor: [10, 10],
	labelAnchor: [6, 0] // as I want the label to appear 2px past the icon (10 + 2 - 6)
});
L.marker([-37.7772, 175.2606], {
	icon: myIcon
}).bindLabel('My label', {
	noHide: true,
	direction: 'auto'
});
````

##Positioning the label for custom icons

The label is positioned relative to the L.Icon's ````iconAnchor```` option. To reposition the label set the ````labelAnchor```` option of your icon. By default ````labelAnchor```` is set so the label will show vertically centered for the default icon (````L.Icon.Default````).

E.g. Vertically center an icon with ````iconAnchor```` set as the center of the icon:

````js
var myIcon = L.icon({
	iconUrl: 'my-icon.png',
	iconSize: [20, 20],
	iconAnchor: [10, 10],
	labelAnchor: [6, 0] // as I want the label to appear 2px past the icon (10 + 2 - 6)
});
L.marker([-37.7772, 175.2606], {
	icon: myIcon
}).bindLabel('Look revealing label!').addTo(map);
````

When positioning the label L.Label includes a 6px horizontal padding. you will need to take this into account when setting ````labelAnchor````.

##Setting the opacity of a label

You can set the opacity of a label by calling the `setOpacity` method on `L.Marker`. By default the opacity will either be **0** or **1**. 

````js
// Sets opacity of marker to 0.3 and opacity of label to 1
markerLabel.setOpacity(0.3);

// Sets opacity of marker to 0.3 and opacity of label to 0.3
markerLabel.setOpacity(0.3, true);

// Sets opacity of marker to 0 and opacity of label to 0
markerLabel.setOpacity(0);
markerLabel.setOpacity(0, true);

// Sets opacity of marker to 1 and opacity of label to 1
markerLabel.setOpacity(1);
markerLabel.setOpacity(1, true);
````

##Alternative label plugin

My previous label plugin is still available at https://github.com/jacobtoye/Leaflet.iconlabel. This plugin is a little harder to use, however if you want to have both the icon and label bound to the same event this plugin is for you.
