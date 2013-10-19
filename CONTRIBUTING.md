## How to contribute

You can use grunt/karma to test your code, and grunt/jshint to lint your code.
First, make sure you have npm and grunt-cli installed globally.

```
# Inside the project dir, install the dependencies
$ npm install

# JSHINT
$ grunt jshint
Running "jshint:files" (jshint) task
>> 2 files lint free.

Done, without errors.

# Execute the tests
$ grunt test
unning "karma:unit" (karma) task
INFO [karma]: Karma v0.10.2 server started at http://localhost:9018/
INFO [launcher]: Starting browser Firefox
INFO [Firefox 24.0.0 (Linux)]: Connected on socket bnKmKpTV3cNSXFDyvjdC
Firefox 24.0.0 (Linux): Executed 74 of 74 SUCCESS (1.021 secs / 0.801 secs)

Running "connect:testserver" (connect) task
Started connect web server on 127.0.0.1:8000.

Running "karma:e2e" (karma) task
INFO [karma]: Karma v0.10.2 server started at http://localhost:9876/_karma_/
INFO [launcher]: Starting browser PhantomJS
INFO [PhantomJS 1.9.2 (Linux)]: Connected on socket c5s9wh42qsmH6ctIvkh-
PhantomJS 1.9.2 (Linux): Executed 1 of 1 SUCCESS (2.041 secs / 1.782 secs)

Done, without errors.
```

You can execute all the code cycle (lint, pass tests, concat files, uglify, deploy) with the grunt default task, which will start listening for file changes and execute the code cycle whenever a file has been changed.


```
$ grunt
unning "karma:background" (karma) task

Running "watch" task
Waiting...OK
>> File "src/angular-leaflet-directive.js" changed.

Running "karma:background:run" (karma) task
[2013-10-19 14:45:44.815] [DEBUG] config - Loading config /home/dave/dev/angular-leaflet-directive/config/karma.conf.js
PhantomJS 1.9.2 (Linux): Executed 74 of 74 SUCCESS (0.644 secs / 0.477 secs)

Running "jshint:source" (jshint) task
>> 1 file lint free.

Running "jshint:tests" (jshint) task
>> 2 files lint free.

Running "jshint:grunt" (jshint) task
>> 1 file lint free.

Running "ngmin:directives" (ngmin) task
ngminifying src/angular-leaflet-directive.js

Running "uglify:dist" (uglify) task
File "dist/angular-leaflet-directive.min.js" created.

Done, without errors.
Completed in 5.401s at Sat Oct 19 2013 14:45:49 GMT+0200 (CEST) - Waiting...
```
