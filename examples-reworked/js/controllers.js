angular.module('webapp').controller('BasicCenterController', [ '$scope', function($scope) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
}]);

angular.module('webapp').controller('BasicFirstController', [ '$scope', function($scope) {
}]);
