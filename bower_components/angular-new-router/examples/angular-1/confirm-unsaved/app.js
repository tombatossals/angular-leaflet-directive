angular.module('myApp', [
  'ngNewRouter',
  'myApp.index',
  'myApp.editPost',
  'myApp.saveModal'
])
.controller('AppController', ['$router', AppController])
.factory('posts', postsFactory);


function AppController($router) {
  $router.config([
    { path: '/',          component: 'index' },
    { path: '/post/:id',  component: 'editPost' },
  ]);
}

function postsFactory() {
  return {
    '1': { title: 'First Post', content: 'I wrote this first.' },
    '2': { title: 'Second Post', content: 'I wrote this second.' }
  };
}
