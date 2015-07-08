'use strict';

angular.module('phoneKitten', [
  'ngNewRouter',
  'ngAnimate',

  'phoneKitten.phoneDetail',
  'phoneKitten.phoneList',

  'phoneKitten.filters',
  'phoneKitten.services'
]).
controller('AppController', ['$router', AppController]);

function AppController($router) {
  $router.config([
    { path: '/'               , redirectTo: '/phones'    },
    { path: '/phones'          , component: 'phoneList'   },
    { path: '/phones/:phoneId' , component: 'phoneDetail' }
  ]);
}
