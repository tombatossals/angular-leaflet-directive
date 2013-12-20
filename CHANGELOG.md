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
