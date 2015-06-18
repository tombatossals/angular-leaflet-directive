Contributing
============

Issues
------
If you have a bug or enhancement request, please file a Github issue.

When submitting an issue please include context from your test and
your application. If there's an error, please include the error text.

It isn't always easy to understand the bug/problem visually, you can use this [predefined
jsfiddle](http://jsfiddle.net/maistho/9jymzymu/) example which loads a simple map. 
Then you can customize it to demonstrate your issue.

Code style
----------
* We use a [editorconfig](http://editorconfig.org/) file to define indentation, codification, and type of end of line of the archives.
* The style guide we try to use is the [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript).

Commit Messages
----------
* We use the [AngularJS Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) - please adhere to these in all commit messages

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
* **grunt test:unit**. Executes only the [karma](http://karma-runner.github.io) unitary tests.
* **grunt test:e2e**. Executes only the [protractor](https://github.com/angular/protractor) e2e tests.
* **grunt coverage**. Generates a "coverage" folder with an [istanbul](https://github.com/gotwarlost/istanbul) report about the percentage of the code which is covered by the existing tests.
* **grunt**. The default task tries to build the library file and then runs the JSHint filter and unit tests. Let's see an example:

```
$ grunt
Running "jshint:source" (jshint) task
>> 24 files lint free.

Running "jshint:tests" (jshint) task
>> 25 files lint free.

Running "jshint:grunt" (jshint) task
>> 1 file lint free.

Running "concat:dist" (concat) task
File dist/angular-leaflet-directive.pre.js created.

Running "ngAnnotate:dist" (ngAnnotate) task
>> 1 file successfully generated.

Running "uglify:dist" (uglify) task
>> 1 file created.

Running "karma:unit" (karma) task
INFO [karma]: Karma v0.12.23 server started at http://localhost:9018/
INFO [launcher]: Starting browser PhantomJS
connect: res.headerSent: use standard res.headersSent
INFO [PhantomJS 1.9.7 (Windows 7)]: Connected on socket NsAl4vm9SQZj3FYZUyNF with id 811947
PhantomJS 1.9.7 (Windows 7): Executed 55 of 140 SUCCESS (0 secs / 0.242 secs)
PhantomJS 1.9.7 (Windows 7): Executed 73 of 140 SUCCESS (0 secs / 0.462 secs)     
WARN [web-server]: 404: /base/bower_components/leaflet/dist/images/marker-shadow.png
PhantomJS 1.9.7 (Windows 7): Executed 140 of 140 SUCCESS (2.693 secs / 2.844 secs)

Running "concat:license" (concat) task
File dist/angular-leaflet-directive.min.js created.

Done, without errors.
```

After a successful build, a new library distribution file will be generated inside the "dist" folder, which will be ready to use on your project:
```
$ ls -l dist/angular-leaflet-directive.min.js
-rw-r--r-- 1 dave dave 35255 dic 15 10:37 dist/angular-leaflet-directive.min.js
```
