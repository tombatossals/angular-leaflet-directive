var home = angular.module('app.documentation', ['ngNewRouter', 'leaflet-directive', 'hljs']);

home.controller('DocumentationController', [ '$scope', DocumentationController ]);

function DocumentationController() {}
