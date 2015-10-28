angular.module('myApp', [
  'ngNewRouter',
  'myApp.intro',
  'myApp.one',
  'myApp.two',
  'myApp.three',
  'myApp.end'
]).
    controller('AppController', ['$router', AppController]).
    factory('answers', answersFactory);

function AppController($router) {
  $router.config([
    { path: '/',       component: 'intro' },
    { path: '/one',    component: 'one' },
    { path: '/two',    component: 'two' },
    { path: '/three',  component: 'three' },
    { path: '/end',    component: 'end' }
  ]);
}


function answersFactory() {
  return {
    name: null,
    quest: null,
    favoriteColor: null
  };
}
