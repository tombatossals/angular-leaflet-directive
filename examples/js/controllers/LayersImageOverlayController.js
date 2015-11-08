        app.controller("LayersImageOverlayController", [ "$scope", "leafletLogger", "leafletData", "leafletBoundsHelpers", function($scope, leafletLogger, leafletData, leafletBoundsHelpers) {
            var maxbounds = leafletBoundsHelpers.createBoundsFromArray([[-540, -960], [540, 960]]);
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
                maxbounds: maxbounds,
                layers: {
                    baselayers: {
                        sanfrancisco: {
                            name: 'Andes',
                            type: 'imageOverlay',
                            url: 'images/andes.jpg',
                            bounds: [[-540, -960], [540, 960]],
                            layerParams: {
                                showOnSelector: false,
                                noWrap: true,
                                attribution: 'Creative Commons image found <a href="http://www.flickr.com/photos/c32/8025422440/">here</a>'
                            }
                        }
                    },
                }
            });
       }]);