<a name="0.7.9"></a>
### 0.7.9 (2014-10-28)


#### Bug Fixes

* Pass popup options in all calls to marker.bindPopup() ([6f476314](https://github.com/tombatossals/angular-leaflet-directive/commit/6f476314064fa61b8a8177c5f931f4cab045f7ed))
* Solved bug on utfgrid example ([9f78d3af](https://github.com/tombatossals/angular-leaflet-directive/commit/9f78d3af07f31a0765f3886beffa258468101665))
* **center:** Solved the autodiscover problem reported by @facultymatt here: https://github.co ([ba9d6ef0](https://github.com/tombatossals/angular-leaflet-directive/commit/ba9d6ef0c1cc329b5d51b77a7a8971c41aad5fd2))
* **core:**
  * Fixed a map destroy bug reported by @porjo here: https://github.com/tombatossals ([7255d913](https://github.com/tombatossals/angular-leaflet-directive/commit/7255d913c1fd35784552e2315896da39e1c78f55))
  * Fixed a bug in the fuction obtainEffectiveMapId as reported by @porjo here: http ([5e6b73b7](https://github.com/tombatossals/angular-leaflet-directive/commit/5e6b73b702f89911b0914dd9703e830b320c1d7d))
* **examples:** Fixed some mess on the path-types-example ([a40dee24](https://github.com/tombatossals/angular-leaflet-directive/commit/a40dee24345c8b1d96c86dbdb2d17efb03b3bc31))
* **layers:** Added a log error message when no layer type is provided ([53c6bcb4](https://github.com/tombatossals/angular-leaflet-directive/commit/53c6bcb49012e44bf7903ffb04e04a59cf01251d))


#### Features

* Updated examples ([0e7d02bb](https://github.com/tombatossals/angular-leaflet-directive/commit/0e7d02bb43d83c0fecce80f5b63a162e9dbf687d))
* **examples:**
  * Little improvement on decorations-simple-example.html ([45731004](https://github.com/tombatossals/angular-leaflet-directive/commit/45731004add1d11994071e2e5d3935f08c081b87))
  * new example of paths with ajax loading of data ([99ca74f3](https://github.com/tombatossals/angular-leaflet-directive/commit/99ca74f31094e171bbf7a3de13700f3fed643407))
  * Updated simple layers example with Mapbox maps ([fabaa051](https://github.com/tombatossals/angular-leaflet-directive/commit/fabaa051c3ba94039dc8e26b172d0fb3116f43a0))


<a name="0.7.8"></a>
### 0.7.9 (2014-10-28)

#### Features

19 pull requests were merged since the previous version: https://github.com/tombatossals/angular-leaflet-directive/pulls?q=is%3Apr+merged%3A2014-08-27..2014-10-28

### 0.7.8 (2014-08-27)

#### Features

Lot of new features and bugfixes added by the community: https://github.com/tombatossals/angular-leaflet-directive/pulls?q=is%3Apr+is%3Aclosed
* **build:** Used load-grunt-config to modularize the build process ([56440881](https://github.com/tombatossals/angular-leaflet-directive/commit/564408815b55ec5922e8dacf3f78e6f3930fd78a))


<a name="0.7.6"></a>
### 0.7.6 (2014-03-20)


#### Bug Fixes

* **center:** solved a bug with the autoDiscover property. ([823934db](https://github.com/tombatossals/angular-leaflet-directive/commit/823934db787c7b372142cf8bcf3204d11139cf2c))
* **markers:** Bug solved which prevents to create a markers group without overlay ([2017f1a0](https://github.com/tombatossals/angular-leaflet-directive/commit/2017f1a06778502e4145a6dbc6756a133b1827c8))
* **tiles:** Fixed a bug related with multiple maps on screen and tiles. Thanks to @gabrielha ([3a774523](https://github.com/tombatossals/angular-leaflet-directive/commit/3a7745233ffe7e95269073be6640fc7ef3777cdc))
* **url-center:** round the latlng to 4 digits as suggested by @fbuchinger here: ([4a6d755e](https://github.com/tombatossals/angular-leaflet-directive/commit/4a6d755eda22d29feb0b1149b6458a3600170b61))


#### Features

* **build:**
  * Added a special property "url-hash-center" which allows to sync the center with  ([e361dad6](https://github.com/tombatossals/angular-leaflet-directive/commit/e361dad66596be4875864d522ea5599deb83ca72))
  * Dinamically add and remove the layers control. ([ac0ce4be](https://github.com/tombatossals/angular-leaflet-directive/commit/ac0ce4bebffda65e6a834a72019a9bd82e37cae2))
  * Added a new GeoJSON layer. Thanks to @cktong: ([e9c391d2](https://github.com/tombatossals/angular-leaflet-directive/commit/e9c391d2813a08deb57dd9dfc07459e25eb00ccf))
* **documentation:** Added more "markers" attribute documentation. ([4dacd3d0](https://github.com/tombatossals/angular-leaflet-directive/commit/4dacd3d022a090ab83189e0bccdf71754df6543e))
* **example:** Added a new example of marker clustering without overlays ([8a65587d](https://github.com/tombatossals/angular-leaflet-directive/commit/8a65587d3f6d6c0ec17be1ab7fc3beacf3e23449))
* **test:** Added unitary tests and protractor tests for the new url-hash-center property ([d43ff384](https://github.com/tombatossals/angular-leaflet-directive/commit/d43ff38459df9495774af8fea899f8aa06349f66))
* **url-center-hash:** Listen for URL changes to update the center. ([ebad6267](https://github.com/tombatossals/angular-leaflet-directive/commit/ebad62678ac23ed2ae9e6a1353cac09e25a2a010))


<a name="v0.7.4"></a>
### v0.7.4 (2014-02-09)


#### Features

* **build:**
  * Solved some bugs with the markers management, and reworked example markers-updat ([754db7f6](https://github.com/tombatossals/angular-leaflet-directive/commit/754db7f6fa3bf0221f61fe45da5600d3cb11c539))
  * Embed default marker icon as a base64 string. Thanks to @couclock for reporting  ([b0e40cb5](https://github.com/tombatossals/angular-leaflet-directive/commit/b0e40cb585fba476e30ce5aa1477c9fcd3afc4f6))
  * travis integration with coveralls.io. ([82709893](https://github.com/tombatossals/angular-leaflet-directive/commit/82709893f494c34606c729ee7b39c002128d1cc1))
* **documentation:** Initial "markers" attribute documentation. ([ec7dc696](https://github.com/tombatossals/angular-leaflet-directive/commit/ec7dc6960566cbcf90008b0c216100c918100cab))
* **layers:** Added the GeoJSON layer functionality by @cktong. ([fba0d0d1](https://github.com/tombatossals/angular-leaflet-directive/commit/fba0d0d11af16beb2785d70b822f21dde3f235bf))
* **markers:** When a marker popup is changed on map the marker object is updated in the scope ([ae66898a](https://github.com/tombatossals/angular-leaflet-directive/commit/ae66898adb17cc20b8a91fe783bc26b0c07552b3))

<a name="v0.7.3"></a>
### v0.7.3 (2014-01-11)

The most important change of this release is the overhaul of the markers attribute, which has some implications to mantain backwards compatibility. The icon definition inside a marker must be done without calling explicitly Leaflet Icon creation function. So, instead of:

```
marker = {
    name: "example",
    icon: L.icon({
        ...
    })
}
```

We will use:
```
marker = {
    name: "example",
    icon: {
        ...
    }
}
```

You can take a look at the demo page to see examples of this change:
[http://tombatossals.github.io/angular-leaflet-directive/#!/examples/customized-markers](http://tombatossals.github.io/angular-leaflet-directive/#!/examples/customized-markers)

#### Features

* **Gruntfile:** Updated protractor-runner to allow running the e2e tests from various browsers f ([01e9f0da](https://github.com/tombatossals/angular-leaflet-directive/commit/01e9f0da2d8044ed59300d660f2d666a09bd15ac))
* **build:**
  * Added the possibility to group the markers in MarkerCluster without using overla ([0d35b2c6](https://github.com/tombatossals/angular-leaflet-directive/commit/0d35b2c68d81d5c0a5557d7a51d23ba2798104d6))
  * Moved all the event management functionality into leafletEvents service. ([cd5fc09a](https://github.com/tombatossals/angular-leaflet-directive/commit/cd5fc09af881089e011cc40e1fae2ca6247681bd))
  * Refactor paths attribute ([c321784e](https://github.com/tombatossals/angular-leaflet-directive/commit/c321784e51cb4f20eca0c0455cd1d4e85391d35b))
* **documentation:**
  * Updated paths attribute documentation ([082b16c4](https://github.com/tombatossals/angular-leaflet-directive/commit/082b16c46a30a6d712d0f3a8fe180ad76ea1fb4e))
  * Started the paths attribute documentation ([972cad1e](https://github.com/tombatossals/angular-leaflet-directive/commit/972cad1e01b306a45f28fe1ce5ea235c8536c80b))
* **examples:**
  * New example of layer+markers with markerclustering usage ([d0230d07](https://github.com/tombatossals/angular-leaflet-directive/commit/d0230d07daa56ce584bb7b698c1fb02ee13c2587))
  * New examples of markers attribute. ([753e509f](https://github.com/tombatossals/angular-leaflet-directive/commit/753e509fd5850ad56a22b54ba9ac95ecdea2faf4))
  * Added a new and simplified paths example ([2e991d73](https://github.com/tombatossals/angular-leaflet-directive/commit/2e991d73e7b29cdca869a2e330719e566eac6f91))
  * Added a new simplified example to the paths attribute ([c380b742](https://github.com/tombatossals/angular-leaflet-directive/commit/c380b74256a380a9fddf79e19cf7c45d80782498))
  * Added a new paths example: paths-simple-example.html ([66bc6920](https://github.com/tombatossals/angular-leaflet-directive/commit/66bc6920d63e888833a11697e507aaeddc9f0756))
  * All the examples dependencies linked to the bower_components folder. ([d9b0cdbf](https://github.com/tombatossals/angular-leaflet-directive/commit/d9b0cdbf2511adc63eb340770e572af325cd9340))
* **markers:** The icon definition has ben changed to be an object of properties, not a Leaflet ([b45df205](https://github.com/tombatossals/angular-leaflet-directive/commit/b45df2050ca3771c07e5e105db81074cf5a2fe80))
* **tests:** Added a new E2E protractor tests for the paths-simple-example.html ([c74c2314](https://github.com/tombatossals/angular-leaflet-directive/commit/c74c2314f437c3be994c1c0c20a993020370ac4f))

#### Bug Fixes

* **paths:** Solved a bug on the scope watching of the paths attribute. ([0663b309](https://github.com/tombatossals/angular-leaflet-directive/commit/0663b309b99cb98629390a6f58424ed671007eec))


<a name="v0.7.2"></a>
### v0.7.2 (2013-12-29)


#### Bug Fixes

* **build:**
  * When a baselayer + overlay was added the layer switch control was not shown. ([20ca399c](https://github.com/tombatossals/angular-leaflet-directive/commit/20ca399c9e4fab41d1d8e73db63610e0c9504bc1))
  * Solved some performance and functional issues with the "bounds" attribute. ([901259a8](https://github.com/tombatossals/angular-leaflet-directive/commit/901259a8fd93e15b6cf6450fa704b160fc9113d2))
* **features:** Reworked 'maxBounds' attribute with new maxbounds-example.html ([e60a1528](https://github.com/tombatossals/angular-leaflet-directive/commit/e60a1528616405015f98392f94c3bc2c96e557f8))
* **tests:** Fixed the waiting times on the protractor e2e test googlemaps-example.html ([4e67f35e](https://github.com/tombatossals/angular-leaflet-directive/commit/4e67f35ef9e72de3e0e7d05d62099714b905b1d8))


#### Features

* **build:**
  * 'maxbounds' updated to work with leaflet 0.7.1 ([fe575010](https://github.com/tombatossals/angular-leaflet-directive/commit/fe57501046b9e4edfffa0897d7566b1c54cf6765))
  * 'maxBounds' attribute renamed as 'maxbounds'. ([b2f541c3](https://github.com/tombatossals/angular-leaflet-directive/commit/b2f541c38b017f28f171b914ab96fcdf5b3be40f))
  * Updated grunt-protractor-runner and protractor configuration to version 0.15.0 ([ea836c3a](https://github.com/tombatossals/angular-leaflet-directive/commit/ea836c3a27aab60a2d8feab0dd84de42bb337a0d))
  * Added a new createBoundsFromArray helper, proposed by @lukasz-zak here: https:// ([0adacda1](https://github.com/tombatossals/angular-leaflet-directive/commit/0adacda1173113e514db2ecd5d20128ec42caacd))
  * Added a new service of bounds helpers: leafletBoundsHelpers ([eac699aa](https://github.com/tombatossals/angular-leaflet-directive/commit/eac699aae039b82e0dec8da80b0b53b9ba1f7256))
* **documentation:**
  * Added the 'layers' documentation section. ([bf783e8a](https://github.com/tombatossals/angular-leaflet-directive/commit/bf783e8a18a23c89c6eeda1737097acd0388f88a))
  * Added the layers attribute documentation ([d26b01a1](https://github.com/tombatossals/angular-leaflet-directive/commit/d26b01a15cb0f8fdd4265a2c7749d33d07ffd56a))
* **examples:**
  * Added a new example: layers-imageoverlay-example.html ([ebfd4b6a](https://github.com/tombatossals/angular-leaflet-directive/commit/ebfd4b6a687656b0b6ca2ed0b5a6ef94b6db1d59))
  * Added a new overlays-simple-example.html ([55a24a2e](https://github.com/tombatossals/angular-leaflet-directive/commit/55a24a2e41b4842e0c58775ccc18e75268f70978))
  * Added the tiles-zoom-changer example by @yagoferrer as an standalone example. ([8abe8b4e](https://github.com/tombatossals/angular-leaflet-directive/commit/8abe8b4e3ed5c1284244742063ebfceab2ce6467))
* **test:**
  * Added a test for overlay-simple-example.html ([61342200](https://github.com/tombatossals/angular-leaflet-directive/commit/6134220022a8416a384f94c50395e5a447297eda))
  * Added the SauceLabs selenium testing to the travis build CI ([51d51544](https://github.com/tombatossals/angular-leaflet-directive/commit/51d51544b3d7760c790515b2f6343c736c8e9df4))
  * Added a new e2e test for layers-simple-example.html ([85ac00fc](https://github.com/tombatossals/angular-leaflet-directive/commit/85ac00fc015a22130b0490a04ee32d106e4936db))
  * Added a new test for the maxbounds-example.html ([ee45e410](https://github.com/tombatossals/angular-leaflet-directive/commit/ee45e410736b40a17e846918a3f8223fd870e098))
* **tests:** Added a new e2e test for: layers-imageoverlay-example.html ([5eb20dc1](https://github.com/tombatossals/angular-leaflet-directive/commit/5eb20dc128c7c3866fce15475a277c5858ae3b05))

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
