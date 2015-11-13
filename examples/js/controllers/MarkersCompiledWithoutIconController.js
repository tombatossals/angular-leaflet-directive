  app.controller('MarkersCompiledWithoutIconController', [ '$scope', function($scope) {
    $scope.setSourceMarker = function () {
      alert($scope.markers.popup.lat + " " + $scope.markers.popup.lng)
    }
    $scope.setDestinationMarker = function () {
      alert($scope.markers.popup.lat + " " + $scope.markers.popup.lng)
    };
    var getNewPopupMarker = function(lat, lng) {
      return {
        lat: lat,
        lng: lng,
        focus: true,
        opacity: 1,
        icon: {
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsIFR0j2j5hUQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC', // Transparent pixel
          iconSize:     [0, 0], // size of the icon
          popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        },
        message: "<button ' \
                  ng-click='setSourceMarker()'>First button</button> \
                  <button class='btn btn-danger btn-block' \
                  ng-click='setDestinationMarker()'>Second button</button>",
        getMessageScope: function () {
          return $scope;
        },
      };
    };
    $scope.$on("leafletDirectiveMap.click", function (event, args) {
      var leafEvent = args.leafletEvent;
      var lat = leafEvent.latlng.lat;
      var lng = leafEvent.latlng.lng;
      $scope.markers.popup.lat = lat;
      $scope.markers.popup.lng = lng;
      $scope.markers.popup.focus = true;
    });
    angular.extend($scope, {
      chicago: {
          lat: 41.85,
          lng: -87.65,
          zoom: 8
      },
      markers: {
        popup: getNewPopupMarker(41.85, -87.65)
      }
    });
  }]);