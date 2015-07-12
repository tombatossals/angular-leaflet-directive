var home = angular.module('app.home', ['ngNewRouter', 'leaflet-directive', 'hljs']);

home.controller('HomeController', [ '$scope', HomeController ]);
home.controller('BasicCenterController', [ '$scope', BasicCenterController ]);

function HomeController() {}
