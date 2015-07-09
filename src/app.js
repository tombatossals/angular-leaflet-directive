var app = angular.module('app', ['ngNewRouter', 'leaflet-directive', 'hljs', 'app.home']);
var controller = app.controller('AppController', [ '$router', AppController ]);

AppController.$routeConfig = [
    { path: '/', component: 'home' }
];

function AppController ($router) {}
