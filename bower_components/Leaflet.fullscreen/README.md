## Leaflet.fullscreen
A HTML5 fullscreen plugin for Leaflet.

### Usage

``` js
var map = new L.Map('map', {
    fullscreenControl: true
});
```

### API

``` js
map.isFullscreen() // Is the map fullscreen?
map.toggleFullscreen() // Either go fullscreen, or cancel the existing fullscreen.

// `fullscreenchange` Event that's fired when entering or exiting fullscreen.
map.on('fullscreenchange', function () {
    if (map.isFullscreen()) {
        console.log('entered fullscreen');
    } else {
        console.log('exited fullscreen');
    }
});

L.Control.Fullscreen // A fullscreen button. Or use the `{fullscreenControl: true}` option when creating L.Map.
```

### Including via CDN

Leaflet.fullscreen is [available through the Mapbox Plugin CDN](https://www.mapbox.com/mapbox.js/plugins/#leaflet-fullscreen) - just copy this include:

```html
<script src='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.2/Leaflet.fullscreen.min.js'></script>
<link href='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.2/leaflet.fullscreen.css' rel='stylesheet' />
```

### Building

    npm install && make

__ProTip__ You may want to install `watch` so you can run `watch make`
without needing to execute make on every change.
