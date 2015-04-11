            app.controller('PathsAdvancedController', [ '$scope', function($scope) {
                $scope.addMarker = function() {
                    var m_key = document.getElementById('new_mm_name').value;
                    if ($scope.markers[m_key]) return;
                    $scope.markers[m_key] = {
                        lat: document.getElementById('new_mm_lat').value,
                        lng: document.getElementById('new_mm_lng').value,
                        draggable: true
                    };
                    $scope.paths.p1.latlngs.push($scope.markers[m_key]);
                };
                $scope.deleteMarker = function(m_key) {
                    var marker = $scope.markers[m_key];
                    for (var pkey in $scope.paths) {
                        for (var j in $scope.paths[pkey].latlngs) {
                            var p = $scope.paths[pkey].latlngs[j];
                            if (p === marker) {
                                $scope.paths[pkey].latlngs.splice(j, 1);
                            }
                        }
                    }
                    delete $scope.markers[m_key];
                };
                angular.extend($scope, {
                    // set up map center
                    cen: {
                        lat: 53,
                        lng: -3,
                        zoom: 6
                    },
                    // set up multiple markers on map
                    markers: {
                        London : {
                            lat: 51.50,
                            lng: -0.082,
                            draggable: false
                        },
                        Manchester: {
                            lat: 53.48,
                            lng: -2.24,
                            draggable: true
                        },
                        Lincoln: {
                            lat: 53.230495,
                            lng: -0.53936,
                            draggable: true
                        },
	                    Northhampton: {
                            lat: 52.237892,
                            lng: -0.90087,
                            draggable: true
	                    },
	                    Worcester: {
                            lat: 52.187404,
                            lng: -2.20275,
                            draggable: true
	                    },
	                    York: {
		                    lat: 53.959317,
		                    lng: -1.08215,
		                    draggable: true
	                    }
                    }
                });
                angular.extend($scope, {
                    paths: {
                        p1: {
                            color: '#008000',
                            weight: 4,
                            latlngs: [ $scope.markers.London, $scope.markers.Manchester ]
                        },
                        p2: {
                            weight: 3,
                            opacity: 0.5,
                            latlngs: [
	                            [ $scope.markers.London, $scope.markers.Lincoln ],
                                [ $scope.markers.Manchester, $scope.markers.Worcester]
                            ],
	                        type: 'multiPolyline'
                        },
	                    c1: {
		                    weight: 2,
		                    color: '#ff612f',
		                    latlngs: $scope.markers.Northhampton,
		                    radius: 10000,
		                    type: 'circle'
	                    },
	                    c2: {
		                    weight: 2,
		                    color: '#ff612f',
		                    latlngs: $scope.markers.Lincoln,
		                    radius: 50,
		                    type: 'circleMarker'
	                    },
	                    pg1: {
		                    latlngs: [ $scope.markers.London, $scope.markers.Worcester, $scope.markers.Lincoln ],
		                    stroke: false,
		                    fillColor: '#ff69b4',
		                    type: 'polygon'
	                    },
	                    pg2: {
                            weight: 1,
                            color: '#2e3974',
                            latlngs: [
	                            [ $scope.markers.London, $scope.markers.Worcester, $scope.markers.Northhampton ],
                                [ $scope.markers.Manchester, $scope.markers.Lincoln, $scope.markers.York ]
                            ],
		                    type: 'multiPolygon'
	                    },
	                    r1: {
		                    latlngs: [ $scope.markers.Lincoln, $scope.markers.York ],
		                    type: 'rectangle'
	                    }
                    }
                });
            } ]);