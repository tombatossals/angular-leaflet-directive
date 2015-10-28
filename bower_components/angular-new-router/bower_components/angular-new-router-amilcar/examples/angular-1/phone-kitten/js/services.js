'use strict';

angular.module('phoneKitten.services', ['ngResource']).
    factory('Phone', ['$resource', Phone]);

function Phone($resource) {
  return $resource('phones/:phoneId.json', {}, {
    query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
  });
}
