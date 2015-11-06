# Angular Leaflet Directive

[AngularJS](http://angularjs.org/) directive for the [Leaflet](http://www.leafletjs.com/) Javascript
Library. This software aims to easily embed maps managed by Leaflet on your project.

### [tombatossals/angular-leaflet-directive](http://github.com/tombatossals/angular-leaflet-directive)
This is a personal project, which has been coded by me helped by many people for some years. I'm evolving it frequently, actually I'm making the code transition to Leaflet 1.0 and Angular 2. If you need enterprise for older versions, sorry, I can't give you more support that my spare time allows me. If you want to help with the actual code it would be really appreciated, but first of all, please, read the * [CONTRIBUTING documentation](https://github.com/tombatossals/angular-leaflet-directive/blob/master/CONTRIBUTING.md)


[![Build Status](https://travis-ci.org/tombatossals/angular-leaflet-directive.png?branch=master)](https://travis-ci.org/tombatossals/angular-leaflet-directive) [![Dependencies](https://david-dm.org/tombatossals/angular-leaflet-directive.svg)](https://david-dm.org/tombatossals/angular-leaflet-directive)&nbsp;
[![Dependencies](https://david-dm.org/tombatossals/angular-leaflet-directive/dev-status.svg)](https://david-dm.org/tombatossals/angular-leaflet-directive) [![Coverage
Status](https://coveralls.io/repos/tombatossals/angular-leaflet-directive/badge.png?branch=master)](http://tombatossals.github.io/angular-leaflet-directive/coverage/PhantomJS%201.9.7%20%28Linux%29/lcov-report/dist/angular-leaflet-directive.js.html)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

### [angular-ui](http://github.com/angular-ui/ui-leaflet)
If you need better response time with your doubts and needs with the code of version 0.9.0, take a look at the [angular-ui](http://github.com/angular-ui/ui-leaflet) fork of this project, it's lead by really awesome developers which have helped me evolving the project for some time.

[![Build Status](https://travis-ci.org/angular-ui/ui-leaflet.png?branch=master)](https://travis-ci.org/angular-ui/ui-leaflet) [![Dependencies](https://david-dm.org/angular-ui/ui-leaflet.svg)](https://david-dm.org/angular-ui/ui-leaflet)&nbsp;
[![Dependencies](https://david-dm.org/angular-ui/ui-leaflet/dev-status.svg)](https://david-dm.org/angular-ui/ui-leaflet) [![Coverage
Status](https://coveralls.io/repos/angular-ui/ui-leaflet/badge.png?branch=master)](http://realtymaps.github.io/ui-leaflet/coverage/PhantomJS%201.9.7%20%28Linux%29/lcov-report/dist/ui-leaflet.js.html)

## Examples

[Browse all the examples](http://tombatossals.github.io/angular-leaflet-directive/examples/0000-viewer.html) added by the community to learn about the directive and its possibilities.

## Documentation

Still working on it. In the meantime, take a look at this URL for some minimal descriptions: https://tombatossals.github.com/angular-leaflet-directive

## Getting started/How to use it

Include the `leaflet-directive` dependency on your Angular module:
```
var app = angular.module('demoapp', ['leaflet-directive']);
```

After that, you are ready to rock. Just define some objects with the basic configuration you want reflected in your map and the rendered map will obey you. Also, you can modify that configuration dinamically if you need to. Let's see an example.

### center

If you want to set the map view to a precise position, you can define
the "center" property of the scope (lat, lng, zoom). It will also be updated
interacting on the scope and on the leaflet map in two-way binding. Example:

```javascript
angular.extend($scope, {
    center: {
        lat: 51.505,
        lng: -0.09,
        zoom: 8
    }
});
```

Finally, you must include the markup directive on your HTML page. One important thing is that you must define the map width&height, as attributes of the directive or with CSS code, as you wish.
```html
<leaflet lf-center="center" height="480px" width="640px"></leaflet>
```

If you want to have more than one map on the page and access their respective map objects, add an *id* attribute to your leaflet directive in HTML:

```html
<leaflet id="mymap" lf-center="center" height="480px" width="640px"></leaflet>
```
