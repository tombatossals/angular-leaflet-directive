Contributing
============

Issues
------
If you have a bug or enhancement request, please file an issue.

When submitting an issue, please include context from your test and
your application. If there's an error, please include the error text.

It's always easy to undestand the bug/problem visually, you can use a predefined
jsfiddle example which loads a simple map, which you can use to document your issue:

http://jsfiddle.net/tombatossals/4PhzC/

Code style
----------
* We use a [editorconfig](http://editorconfig.org/) file to define indentation, codification and type of end of line of the archives.
* The style guide we try to use is the [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript).


Software development life-cycle
-------------------------------
There are a some Grunt tasks defined to ease the development cycle. Let's see how to use them:

First, make sure you have npm and grunt-cli installed globally. Let's install the dependencies.

```
# Inside the project dir, install the nodeJS dependencies
$ npm install
npm http GET https://registry.npmjs.org/protractor/0.14.0
npm http GET https://registry.npmjs.org/matchdep
npm http GET https://registry.npmjs.org/grunt-shell
npm http GET https://registry.npmjs.org/grunt-contrib-jshint
npm http GET https://registry.npmjs.org/grunt-contrib-connect
npm http GET https://registry.npmjs.org/grunt-karma
npm http GET https://registry.npmjs.org/grunt-ngmin
...
├── glob@3.1.21 (inherits@1.0.0)
├── minimatch@0.2.12 (sigmund@1.0.0, lru-cache@2.5.0)
├── http-proxy@0.10.3 (pkginfo@0.2.3, utile@0.1.7)
├── lodash@1.1.1
├── log4js@0.6.9 (semver@1.1.4, async@0.1.15, readable-stream@1.0.17)
├── useragent@2.0.7 (lru-cache@2.2.4)
├── connect@2.8.8 (methods@0.0.1, uid2@0.0.2, fresh@0.2.0, cookie@0.1.0, ..., send@0.1.4)
└── socket.io@0.9.16 (base64id@0.1.0, policyfile@0.0.4, redis@0.7.3, socket.io-client@0.9.16)
$
```

And we must install the client libraries dependencies with _bower_ too:
```
[dave@haddock angular-leaflet-directive]$ bower install
bower angular#1.2.x             cached git://github.com/angular/bower-angular.git#1.2.6-build.1989+sha.b0474cb
bower angular#1.2.x           validate 1.2.6-build.1989+sha.b0474cb against git://github.com/angular/bower-angular.git#1.2.x
...
angular-route#1.2.10-build.2164+sha.8b395ff bower_components/angular-route
└── angular#1.2.10-build.2164+sha.8b395ff

angular-animate#1.2.10-build.2164+sha.8b395ff bower_components/angular-animate
└── angular#1.2.10-build.2164+sha.8b395ff

angular#1.2.10-build.2164+sha.8b395ff bower_components/angular
```

Once you have the development dependencies installed, we can use our predefined grunt tasks. For example:

* **grunt test**. Executes the karma unitary tests and the protractor e2e tests, reporting the actual state of the project.
* **grunt test:unit**. Executes only the karma unitary tests.
* **grunt test:e2e**. Executes only the protractor e2e tests.
* **grunt coverage**. Generates a "coverage" folder with an [istanbul](https://github.com/gotwarlost/istanbul) report of wich part of the code is covered by the actual tests.
* **grunt**. The default task watches for project files changes and when a change is detected, tries to build the library file passing the jshint filter and the tests. Let's see an example:

```
$ grunt
Running "watch:source" (watch) task
Waiting...OK
>> File "src/directives/leaflet.js" changed.

Running "jshint:source" (jshint) task
>> 18 files lint free.

Running "jshint:tests" (jshint) task
>> 14 files lint free.

Running "jshint:grunt" (jshint) task
>> 1 file lint free.

Running "concat:dist" (concat) task
File "dist/angular-leaflet-directive.js" created.

Running "ngmin:directives" (ngmin) task
ngminifying dist/angular-leaflet-directive.js

Running "uglify:dist" (uglify) task
File "dist/angular-leaflet-directive.min.no-header.js" created.

Running "karma:unit" (karma) task
INFO [karma]: Karma v0.10.8 server started at http://localhost:9018/
INFO [launcher]: Starting browser PhantomJS
INFO [PhantomJS 1.9.2 (Linux)]: Connected on socket WUeY410y1MZhG5OYnoyc
WARN [web-server]: 404: /base/bower_components/leaflet-dist/images/marker-icon.png
WARN [web-server]: 404: /base/bower_components/leaflet-dist/images/marker-shadow.png
WARN [web-server]: 404: /url
PhantomJS 1.9.2 (Linux): Executed 108 of 108 SUCCESS (0.875 secs / 0.625 secs)

Running "concat:license" (concat) task
File "dist/angular-leaflet-directive.min.js" created.

Done, without errors.
Completed in 9.714s at Sun Dec 15 2013 10:37:59 GMT+0100 (CET) - Waiting...
```

After a successful build, a new library distribution file will be generated inside the "dist" folder, which will be ready to use on your project:
```
$ ls -l dist/angular-leaflet-directive.min.js
-rw-r--r-- 1 dave dave 35255 dic 15 10:37 dist/angular-leaflet-directive.min.js
```
