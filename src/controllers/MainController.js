app.controller("MainController", [ '$scope', '$route', '$routeParams', '$location', function($scope, $route, $routeParams, $location) {

    $scope.$watch(function() { return $location.path(); }, function(value) {
        if (!value) {
            return;
        }
        var section = value.match(/^\/([^\/])*/);
        if (section.length > 0) {
            $scope.activeTab = section[0].replace(/^\//, "");
        }
    });

    $scope.$watch(function() { return $routeParams.example ; }, function(value) {
        $scope.exampleTab = $routeParams.example;
    });
}]);
