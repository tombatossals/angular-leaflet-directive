        app.controller("LayersLayergroupSimpleController", [ "$scope", function($scope) {
            angular.extend($scope, {
                center: {
                    lat: 39,
                    lng: -100,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {}
                }
            });
            var tileLayer = {
              name: 'Countries',
              type: 'xyz',
              url: 'http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.png',
              visible: true,
              layerOptions: {
                attribution: 'Map data &copy; 2013 Natural Earth | Data &copy; 2013 <a href="http://www.reporter-ohne-grenzen.de/ranglisten/rangliste-2013/">ROG/RSF</a>',
                maxZoom: 5
              }
            };
            var utfGrid = {
              name: 'UtfGrid',
              type: 'utfGrid',
              url: 'http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.grid.json?callback={cb}',
              visible: true,
              pluginOptions: {
                maxZoom: 5,
                resolution: 4
              }
            };
            var group = {
              name: 'Group Layer',
              type: 'group',
              visible: true,
              layerOptions: {
                layers: [ tileLayer, utfGrid],
                maxZoom: 5
              }
            };
            $scope.layers['overlays']['Group Layer'] = group;
            $scope.$on('leafletDirectiveMap.utfgridMouseover', function(event, leafletEvent) {
                $scope.country = leafletEvent.data.name;
            });
        }]);