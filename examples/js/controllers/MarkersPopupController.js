        app.controller('MarkersPopupController', [ '$scope', function($scope) {
            angular.extend($scope, {
                london: {
                    lat: 51.505,
                    lng: -0.09,
                    zoom: 8
                },
                markers: {
                    m1: {
                        lat: 51.505,
                        lng: -0.09,
                        focus: true,
                        draggable: false,
                        message: "Hi there!",
                        icon: {}
                    }
                },
            });
            $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Click");
            });
            $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Popup Open");
            });
            $scope.$on('leafletDirectiveMarker.popupclose', function(e, args) {
                // Args will contain the marker name and other relevant information
                console.log("Leaflet Popup Close");
            });
        } ]);