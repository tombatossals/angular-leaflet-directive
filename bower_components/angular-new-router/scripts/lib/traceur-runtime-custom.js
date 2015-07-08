/*
 * artisinal, handcrafted subset of the traceur runtime for picky webdevs
 */

var $defineProperty = Object.defineProperty,
    $defineProperties = Object.defineProperties,
    $create = Object.create,
    $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    $getOwnPropertyNames = Object.getOwnPropertyNames,
    $getPrototypeOf = Object.getPrototypeOf;

function createClass(ctor, object, staticObject, superClass) {
  $defineProperty(object, 'constructor', {
    value: ctor,
    configurable: true,
    enumerable: false,
    writable: true
  });
  if (arguments.length > 3) {
    if (typeof superClass === 'function')
      ctor.__proto__ = superClass;
    ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
  } else {
    ctor.prototype = object;
  }
  $defineProperty(ctor, 'prototype', {
    configurable: false,
    writable: false
  });
  return $defineProperties(ctor, getDescriptors(staticObject));
}

function getProtoParent(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null)
      return superClass.prototype;
    throw new TypeError('super prototype must be an Object or null');
  }
  if (superClass === null)
    return null;
  throw new TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
}

function getDescriptors(object) {
  var descriptors = {};
  var names = $getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $getOwnPropertyDescriptor(object, name);
  }
  // TODO: someday you might use symbols and you'll have to re-evaluate
  //       your life choices that led to the creation of this file

  // var symbols = getOwnPropertySymbols(object);
  // for (var i = 0; i < symbols.length; i++) {
  //   var symbol = symbols[i];
  //   descriptors[$traceurRuntime.toProperty(symbol)] = $getOwnPropertyDescriptor(object, $traceurRuntime.toProperty(symbol));
  // }
  return descriptors;
}
function superDescriptor(homeObject, name) {
  var proto = $getPrototypeOf(homeObject);
  do {
    var result = $getOwnPropertyDescriptor(proto, name);
    if (result)
      return result;
    proto = $getPrototypeOf(proto);
  } while (proto);
  return undefined;
}
function superCall(self, homeObject, name, args) {
  return superGet(self, homeObject, name).apply(self, args);
}
function superGet(self, homeObject, name) {
  var descriptor = superDescriptor(homeObject, name);
  if (descriptor) {
    if (!descriptor.get)
      return descriptor.value;
    return descriptor.get.call(self);
  }
  return undefined;
}
