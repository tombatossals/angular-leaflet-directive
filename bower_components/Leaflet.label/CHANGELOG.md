Leaflet.draw Changelog
======================

## master

An in-progress version being developed on the master branch.

## 0.2.1 (December 13, 2013)

### Plugin improvements

 * Improved performance when setting label content.

### Bug fixes

 * Fixed issue where labels could appear blurry after zoom. 

## 0.2.0 (August 20, 2013)

### Plugin improvements

 * Removed need to call `showLabel` when adding a static label to the map.
 * Added support for changing the direction of the label in relation to the marker. Added auto mode that switches depending on which side of the screen you are on. (adapted from [@erictheise](https://github.com/erictheise) pull request) [#17](https://github.com/Leaflet/Leaflet.label/pull/17)
 * Added `labelAnchor` option to `L.CircleMarker`.

### Bug fixes

 * Fix bug where map view hard reset did not update labels. (by [@dagjomar](https://github.com/dagjomar)). [#43](https://github.com/Leaflet/Leaflet.label/pull/43)
 * Fix issue where non static labels would remain visible if the latlng of the marker changed.

## 0.1.4 (August 20, 2013)

### Bug fixes

 * Fixed error in IE < 9 when trying to set the label z-index. (by [@arthur-e](https://github.com/arthur-e)). [#13](https://github.com/Leaflet/Leaflet.label/pull/25)
 * Fixed an issue when removing the click handler from the container to close labels in touch devices.

## 0.1.3 (May 02, 2013)

### Plugin improvements

 * Added method `L.Marker.setLabelNoHide()` to allow toggling of static marker labels. (inspired by [@kpwebb](https://github.com/kpwebb)). [#20](https://github.com/Leaflet/Leaflet.label/pull/20)
 * Non-static labels will now hide when map container is tapped on touch devices. (by [@snkashis](https://github.com/snkashis)). [#26](https://github.com/Leaflet/Leaflet.label/pull/26)
 * Added ability to set the opacity of the label along with the marker. (inspired by [@snkashis](https://github.com/snkashis)). [#20](https://github.com/Leaflet/Leaflet.label/pull/27)
 * Added support for mouse event to L.Label.
 * Added public getter to L.Marker to retrieve the label associated to a marker.

### Bug fixes

 * Fixed labels not updating position after being dragged. (by [@snkashis](https://github.com/snkashis)). [#13](https://github.com/Leaflet/Leaflet.label/pull/13)
 * Z-Index fixes aimed at static labels. This will ensure that label is shown at the same level as the marker.
 * Correctly remove event listeners in Marker.Label and Path.Label.

## 0.1.1 (December 10, 2012)

### Plugin improvements

 * FeatureGroup now supports label methods.

### Bug fixes

 * Fixed bug where label wouldn't hide when unbindLabel was called.
 * Fixed Multi-Poly support.
 * Fixed bug where a label's position wouldn't be updated when a marker moved.
 * Fixed bug where label wouldn't be removed from map when a marker was. 

## 0.1.0 (October 7, 2012)

Initial version of Leaflet.label
