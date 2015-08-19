var app = angular.module('app.directives', []);

app.directive('ngExample', [ '$http', '$compile', function($http, $compile) {
    return {
        restrict: 'A',
        scope: {
            source: '='
        },
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            scope.$watch('source', function(source) {
                if (!source) {
                    return;
                }
                var $doc = new DOMParser().parseFromString(source, "text/html");
                var body = $doc.body;
                var ctlr = $doc.body.getAttribute('ng-controller');
                var compiled = $compile('<div ng-controller="' + ctlr + '">' + body.innerHTML + '</div>')(scope);
                element.append(compiled);
            });

        }
    };
}]);
