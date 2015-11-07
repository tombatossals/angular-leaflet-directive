angular.module('leaflet-directive').directive('maxbounds', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "maxbounds" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-maxbounds" markup attributes.', 'maxbounds');
    },
  };
});

angular.module('leaflet-directive').directive('defaults', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "defaults" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-defaults" markup attributes.', 'defaults');
    },
  };
});

angular.module('leaflet-directive').directive('bounds', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "bounds" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-bounds" markup attributes.', 'bounds');
    },
  };
});

angular.module('leaflet-directive').directive('controls', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "controls" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-controls" markup attributes.', 'controls');
    },
  };
});

angular.module('leaflet-directive').directive('center', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "center" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-center" markup attributes.', 'center');
    },
  };
});

angular.module('leaflet-directive').directive('paths', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "paths" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-paths" markup attributes.', 'paths');
    },
  };
});

angular.module('leaflet-directive').directive('tiles', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "tiles" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-tiles" markup attributes.', 'tiles');
    },
  };
});

angular.module('leaflet-directive').directive('markers', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "markers" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-markers" markup attributes.', 'markers');
    },
  };
});

angular.module('leaflet-directive').directive('eventBroadcast', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "event-broadcast" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-events" markup attributes.', 'events');
    },
  };
});

angular.module('leaflet-directive').directive('geojson', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "geojson" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-geojson" markup attributes.', 'geojson');
    },
  };
});

angular.module('leaflet-directive').directive('layers', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "layers" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-layers" markup attributes.', 'layers');
    },
  };
});

angular.module('leaflet-directive').directive('markers', function(leafletLogger) {
  return {
    link: function() {
      leafletLogger.error('The "markers" markup code is deprecated now. Please ' +
                 'update your HTML with "lf-markers" markup attributes.', 'markers');
    },
  };
});
