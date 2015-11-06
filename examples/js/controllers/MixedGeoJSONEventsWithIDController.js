        app.controller('MixedGeoJSONEventsWithIDController', [ "$scope", "$http", function($scope, $http) {
            $scope.$on("leafletDirectiveGeoJson.myMap.mouseover", function(ev, leafletPayload) {
                countryMouseover(leafletPayload.leafletObject.feature, leafletPayload.leafletEvent);
            });
            $scope.$on("leafletDirectiveGeoJson.myMap.click", function(ev, leafletPayload) {
                countryClick(leafletPayload.leafletObject, leafletPayload.leafletEvent);
            });
            var continentProperties= {
                    "009": {
                            name: 'Oceania',
                            colors: [ '#CC0066', '#993366', '#990066', '#CC3399', '#CC6699' ]
                    },
                    "019": {
                            name: 'America',
                            colors: [ '#006699', '#336666', '#003366', '#3399CC', '#6699CC' ]
                    },
                    "150": {
                            name: 'Europe',
                            colors: [ '#FF0000', '#CC3333', '#990000', '#FF3333', '#FF6666' ]
                    },
                    "002": {
                            name: 'Africa',
                            colors: [ '#00CC00', '#339933', '#009900', '#33FF33', '#66FF66' ]
                    },
                    "142": {
                            name: 'Asia',
                            colors: [ '#FFCC00', '#CC9933', '#999900', '#FFCC33', '#FFCC66' ]
                    },
            };
            angular.extend($scope, {
                center: {
                    lat: 40.8471,
                    lng: 14.0625,
                    zoom: 2
                },
                legend: {
                    colors: [ '#CC0066', '#006699', '#FF0000', '#00CC00', '#FFCC00' ],
                    labels: [ 'Oceania', 'America', 'Europe', 'Africa', 'Asia' ]
                }
            });
            function countryClick(country, event) {
                country = country.feature;
                console.log(country.properties.name);
            }
            // Get a country paint color from the continents array of colors
            function getColor(country) {
                if (!country || !country["region-code"]) {
                    return "#FFF";
                }
                var colors = continentProperties[country["region-code"]].colors;
                var index = country["alpha-3"].charCodeAt(0) % colors.length ;
                return colors[index];
            }
            function style(feature) {
                return {
                    fillColor: getColor($scope.countries[feature.id]),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
            // Mouse over function, called from the Leaflet Map Events
            function countryMouseover(feature, leafletEvent) {
                var layer = leafletEvent.target;
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    fillColor: 'white'
                });
                layer.bringToFront();
                $scope.selectedCountry = feature;
                console.log(feature);
            }
            // Get the countries data from a JSON
            $http.get("json/all.json").success(function(data, status) {
                // Put the countries on an associative array
                $scope.countries = {};
                for (var i=0; i< data.length; i++) {
                    var country = data[i];
                    $scope.countries[country['alpha-3']] = country;
                }
                // Get the countries geojson data from a JSON
                $http.get("json/countries.geo.json").success(function(data, status) {
                    angular.extend($scope, {
                        geojson: {
                            data: data,
                            style: style,
                            resetStyleOnMouseout: true
                        },
                        selectedCountry: {}
                    });
                });
            });
        }]);