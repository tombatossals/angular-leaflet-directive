# Leaflet.MiniMap

Leaflet.MiniMap is a simple minimap control that you can drop into your leaflet map, and it will create a small map in the corner which shows the same as the main map with a set zoom offset. (By default it is -5.)

## Using the MiniMap control

The control can be inserted in two lines: First you have to construct a layer for it to use, and then you create and attach the minimap control. Don't reuse the layer you added to the main map, strange behaviour will ensue! Alternatively, you can pass in a LayerGroup with multiple layers (for example with overlays or suitably themed markers). Marker layers can't be reused either. (See issue #52 for a discussion of syncronising marker layers.)

From the [example](http://norkart.github.com/Leaflet-MiniMap/example.html):
    
    var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib});
    var miniMap = new L.Control.MiniMap(osm2).addTo(map);

As the minimap control inherits from leaflet's control, positioning is handled automatically by leaflet. However, you can still style the minimap and set its size by modifying the css file.

**Note:** Leaflet version 0.7.3 or higher is required.

###Example usage in CommonJS compatible environments (Node/Browserify)

    var MiniMap = require('leaflet-minimap');
    new MiniMap(layer, options).addTo(map);
    
If you prefer ES6 style (for example with babel):

    import MiniMap from 'leaflet-minimap';
    new MiniMap(layer, options).addTo(map);

###Example usage in AMD compatible environments (RequireJS)

    require(['leaflet-minimap'], function(MiniMap) {
        new Minimap(layer, options).addTo(map);
    });
    
## Available Methods

`changeLayer:` Swaps out the minimap layer for the one provided. See the _layerchange_ example for hints on good uses.

## Available Options
 The mini map uses options which can be set in the same way as other leaflet options, and these are the available options:

`position:` The standard Leaflet.Control position parameter, used like all the other controls. Defaults to 'bottomright'.

`width:` The width of the minimap in pixels. Defaults to 150.

`height:` The height of the minimap in pixels. Defaults to 150.

`collapsedWidth:` The width of the toggle marker and the minimap when collapsed, in pixels. Defaults to 19.

`collapsedHeight:` The height of the toggle marker and the minimap when collapsed, in pixels. Defaults to 19.

`zoomLevelOffset:` The offset applied to the zoom in the minimap compared to the zoom of the main map. Can be positive or negative, defaults to -5.

`zoomLevelFixed:` Overrides the offset to apply a fixed zoom level to the minimap regardless of the main map zoom. Set it to any valid zoom level, if unset `zoomLevelOffset` is used instead.

`zoomAnimation:` Sets whether the minimap should have an animated zoom. (Will cause it to lag a bit after the movement of the main map.) Defaults to false.

`toggleDisplay:` Sets whether the minimap should have a button to minimise it. Defaults to false. 

`autoToggleDisplay:` Sets whether the minimap should hide automatically if the parent map bounds does not fit within the minimap bounds. Especially useful when 'zoomLevelFixed' is set.

`aimingRectOptions:` Sets the style of the aiming rectangle by passing in a [Path.Options object](http://leafletjs.com/reference.html#path-options). (Clickable will always be overridden and set to false.)

`shadowRectOptions:` Sets the style of the aiming shadow rectangle by passing in a [Path.Options object](http://leafletjs.com/reference.html#path-options). (Clickable will always be overridden and set to false.)

`strings:` Overrides the default strings allowing for translation. See below for available strings and `example/example_i18n.html` for an example.

### Available Strings

`hideText:` The text to be displayed as Tooltip when hovering over the toggle button on the MiniMap and it is visible. Defaults to 'Hide MiniMap'

`showText:` The text to be displayed as Tooltip when hovering over the toggle button on the MiniMap and it is hidden. Defaults to 'Show MiniMap'

##Building minified versions
First, install node.js on your system. Then run `npm install` to get the dependencies, and `npm build` to build 
the minified js and css.
