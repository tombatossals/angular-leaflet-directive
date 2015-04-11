        // For more info take a look at https://github.com/kartena/Proj4Leaflet proj4leaflet.js
        app.controller('LayersWMSWithDifferentProjectionController', [ '$scope', '$location', function($scope) {
            $scope.map = {
                defaults: {
                    crs: new L.Proj.CRS('EPSG:3006', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
                    {
                        resolutions: [
                            8192, 4096, 2048, 1024, 512, 256, 128,
                            64, 32, 16, 8, 4, 2, 1, 0.5
                        ],
                        origin: [0, 0]
                    }),
                    continuousWorld: true
                },
                malmo: {
                    lat: 55.5902,
                    lng: 12.9956,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        malmo: {
                            name: 'Fishery',
                            type: 'wms',
                            url: 'http://geodatatest.havochvatten.se/geoservices/ows',
                            visible: true,
                            layerOptions: {
                                layers: 'hav-fisketsgeografier:havet-ostersjons-delomraden',
                                format: 'image/png',
                                maxZoom: 14,
                                minZoom: 0,
                                continuousWorld: true,
                                attribution: '&copy; <a href="https://www.havochvatten.se/kunskap-om-vara-vatten/kartor-och-geografisk-information/karttjanster.html">Havs- och vattenmyndigheten (Swedish Agency for Marine and Water Management)</a>'
                            }
                        }
                    }
                }
            };
        }]);