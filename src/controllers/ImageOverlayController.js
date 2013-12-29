
app.controller("ImageOverlayController", [ "$scope", "$log", "leafletData", "leafletBoundsHelpers", function($scope, $log, leafletData, leafletBoundsHelpers) {
    var maxBounds = leafletBoundsHelpers.createBoundsFromArray([[-540, -960], [540, 960]]);
    angular.extend($scope, {
        defaults: {
          scrollWheelZoom: false,
          crs: 'Simple',
          maxZoom: 2
        },
        center: {
            lat: 0,
            lng: 0,
            zoom: 0
        },
        maxBounds: maxBounds,
        layers: {
            baselayers: {
                andes: {
                    name: 'Andes',
                    type: 'imageOverlay',
                    url: 'examples/img/andes.jpg',
                    bounds: [[-540, -960], [540, 960]],
                    layerParams: {
                      noWrap: true,
                      attribution: 'Creative Commons image found <a href="http://www.flickr.com/photos/c32/8025422440/">here</a>'
                    }
                }
            },
        }
    });
} ]);
