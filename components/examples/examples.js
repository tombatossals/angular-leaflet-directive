var app = angular.module('app.examples', []);

app.controller('ExamplesController', [ '$routeParams', '$http', 'Examples', ExamplesController ]);

function ExamplesController($routeParams, $http, Examples) {

    var self = this;

    if (!$routeParams.section) {
        return;
    }

    Examples.getExample($routeParams).then(function(example) {
        self.example = example;

        $http.get('examples/' + self.example.extUrl).success(function(data) {
            self.example.source = data;
        });
    });
}

app.controller("BasicFirstController", [ "$scope", function($scope) {
    // Nothing here!
}]);

app.controller('BasicCenterAutodiscoverController', [ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            autoDiscover: true
        }
    });
}]);
app.controller('BasicCenterController', [ '$scope', function($scope) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
}]);
app.controller('BasicCenterGeoIPController', [ '$scope', '$http', function($scope, $http) {
    angular.extend($scope, {
        center: {
            lat: 0,
            lng: 0,
            zoom: 2
        }
    });
    $scope.searchIP = function(ip) {
        var url = "http://freegeoip.net/json/" + ip;
        $http.get(url).success(function(res) {
            $scope.center = {
                lat: res.latitude,
                lng: res.longitude,
                zoom: 10
            }
            $scope.ip = res.ip;
        })
    };
    $scope.searchIP("");
}]);
app.controller('BasicCenterUrlHashController', [ '$scope', '$location', function($scope, $location) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
    $scope.$on("centerUrlHash", function(event, centerHash) {
        $location.search({ c: centerHash });
    });
    $scope.changeLocation = function(centerHash) {
        $location.search({ c: centerHash });
    }
}]);
