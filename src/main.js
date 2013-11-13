// Determine if a reference is defined
function isDefined(value) {
    return angular.isDefined(value);
}

// Determine if a reference is defined and not null
function isDefinedAndNotNull(value) {
    return angular.isDefined(value) && value !== null;
}

// Determine if a reference is a number
function isNumber(value) {
  return angular.isNumber(value);
}

// Determine if a reference is a string
function isString(value) {
  return angular.isString(value);
}

// Determine if a reference is an array
function isArray(value) {
  return angular.isArray(value);
}

// Determine if a reference is an object
function isObject(value) {
  return angular.isObject(value);
}

// Determine if two objects have the same properties
function equals(o1, o2) {
  return angular.equals(o1, o2);
}

function safeApply($scope, fn) {
    var phase = $scope.$root.$$phase;
    if (phase === '$apply' || phase === '$digest') {
        $scope.$eval(fn);
    } else {
        $scope.$apply(fn);
    }
}
