var app = angular.module('app.examples', [ 'ngNewRouter']);

app.controller('ExamplesController', [ '$router', '$scope', '$timeout', ExamplesController ]);

function ExamplesController($router, $scope, $timeout) {
    $router.config([
        {
            path: '/:section/:example',
            component: 'BasicFirstController'

        }
    ]);

    $timeout(function() {
        $('.ui.menu .browse')
          .popup({
            inline   : true,
            hoverable: true,
            position : 'bottom left',
            delay: {
              show: 300,
              hide: 800
            }
          })
        ;
    }, 200);
}
