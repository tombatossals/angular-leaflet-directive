<a name="v0.7.1"></a>
## v0.7.1 (2013-12-22)


#### Bug Fixes

* **build:**
  * Solved a problem with the render of the Google Maps Layer, reported by @pwoloszu ([73f17c0b](https://github.com/tombatossals/angular-leaflet-directive/commit/73f17c0bab25988151e43fc539630a648cc15835))
  * Removed the center undefined log message as noted by @ngoldman here: https://git ([a41e4efb](https://github.com/tombatossals/angular-leaflet-directive/commit/a41e4efbccb27c83975b135b9c237db1bd80d3d8))
* **grunt:** Added the e2e protractor tests to the Grunt watch cycle. ([95ac1831](https://github.com/tombatossals/angular-leaflet-directive/commit/95ac183163446f6d9e977bea1db6346ebf3d2152))
* **libraries:** Updated Leaflet.markercluster to version 0.4 on bower.json. Thanks to @Hyzhak fo ([a7adada0](https://github.com/tombatossals/angular-leaflet-directive/commit/a7adada0679ccea50b7c4b51e87e94e504b7cd96))
* **test:** Updated e2e tests to pass the jshint validations ([acee2b02](https://github.com/tombatossals/angular-leaflet-directive/commit/acee2b02f1499f7a2beee8d6ebcdc8be0a816dd9))
* **tests:** Some code updates to the e2e tests ([5e47141b](https://github.com/tombatossals/angular-leaflet-directive/commit/5e47141b04662283e2c1cca4379a093ba40a8d4e))


#### Features

* **examples:** Make the buttons toggable on the marker-groups-example.html made by @yagoferrer  ([0699cf7b](https://github.com/tombatossals/angular-leaflet-directive/commit/0699cf7ba63261c4c8ec39b2cec3af032dce3067))
* **test:**
  * Added a test for the googlemaps-example.html ([98f68c0a](https://github.com/tombatossals/angular-leaflet-directive/commit/98f68c0a0ff82d4317f066679d2707b46f57ec81))
  * Added an e2e test to the custom-parameters-example.html ([3ce6a721](https://github.com/tombatossals/angular-leaflet-directive/commit/3ce6a721a6bfd24158574935dc214871a8c84ef2))
  * Completed e2e tests for the bounds example. ([1c40d605](https://github.com/tombatossals/angular-leaflet-directive/commit/1c40d605553506c2073d6afd70ec6da1b506ec3c))

<a name="v0.7.0"></a>
### v0.7.0 (2013-12-15)


#### Bug Fixes

* **build:** Removed the center undefined log message as noted by @ngoldman here: https://git ([08b569ff](https://github.com/tombatossals/angular-leaflet-directive/commit/08b569ff05f2a4c8cd9dbe1a01f06875c0e05a8c))


#### Features

* **Documentation:** More detailed documentation of how to contribute to the project. ([5eaf07f9](https://github.com/tombatossals/angular-leaflet-directive/commit/5eaf07f9a3b74e0eb9a4c2dfe178915baee049e0))
* **build:**
  * We can disable the watch on the markers adding a 'watch-markers="no"' to our dir ([543b6259](https://github.com/tombatossals/angular-leaflet-directive/commit/543b6259dd4edce10cd55761f728583d35cc54b2))
  * Added a new service leafletMarkerHelpers with the methods needed to manage the m ([f0dadafb](https://github.com/tombatossals/angular-leaflet-directive/commit/f0dadafbed777d3f12c6614cde7a2609bf8b521e))
  * Re-worked layer type code, lot easier to add new layer types now. ([061a52ca](https://github.com/tombatossals/angular-leaflet-directive/commit/061a52ca4eeda06f436ca4d927ae08148e5e1807))
  * Only show the layer selector switch control if the layers added are more than on ([343a662b](https://github.com/tombatossals/angular-leaflet-directive/commit/343a662b3d8de3cef447949bcb4679fd22d1ee60))
  * Added a new layers management example (layers-simple-example.html). ([1be141c2](https://github.com/tombatossals/angular-leaflet-directive/commit/1be141c2889361523af335001e59d3870a5c1157))
* **documentation:**
  * Started a new documentation section inside the folder "doc" of the project, writ ([cf238d71](https://github.com/tombatossals/angular-leaflet-directive/commit/cf238d713c47f1b9c54bf020b38ce55749511a65))
  * Added a detailed CONTRIBUTING.md file which explains the software development cy ([c773738f](https://github.com/tombatossals/angular-leaflet-directive/commit/c773738fa46e607e2ee9be4db8e2154792f4770d))
* **test:** Added a new e2e test for the bounds-example.html ([1fa57eb9](https://github.com/tombatossals/angular-leaflet-directive/commit/1fa57eb96497445d3b88cfb783c661c9405fd72f))
