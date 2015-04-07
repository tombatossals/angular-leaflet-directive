        app.controller('BasicCenterAutodiscoverController', [ '$scope', function($scope) {
            angular.extend($scope, {
                center: {
                    autoDiscover: true
                }
            });
       }]);