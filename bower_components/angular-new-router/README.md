# The New Angular Router
[![Build Status](https://travis-ci.org/angular/router.svg?branch=master)](https://travis-ci.org/angular/router)

A work-in-progress new router for Angular 1.3 and 2.0, written with
[AtScript](https://docs.google.com/document/d/11YUzC-1d0V1-Q3V0fQ7KSit97HnZoKVygDxpWzEYW0U/).


## State of this project

Currently, the router is usable in Angular 1, but still missing many of the planned features.
APIs will rapidly change, so I do not recommend using this in an important production app quite yet.

See the [Progress Document](https://docs.google.com/document/d/1-DBXTHaeec6XH5qx2tKVrgrjiILy76_lSrjgJv95RJ4/edit#)
for standup-style updates

### Trying the router

You can install the router via `npm`:

```shell
npm install angular-new-router
```

The documentation is pretty sparse. See the `examples/` directory in this repo for now.

### Helping out

For now, the best way for you to help with the new router is to try it out and file GitHub issues
with questions or feedback. Please also [check out existing discussions](https://github.com/angular/router/labels/type%3A%20use%20case).

## Goals

This router aims to fulfill the requirements mentioned in the [Angular 2.0 router design document](https://docs.google.com/document/d/1I3UC0RrgCh9CKrLxeE4sxwmNSBl3oSXQGt9g3KZnTJI).

Below is a short summary of these goals:

* Have sensible conventions and defaults
* Be customizable at almost every point
* Support sibling "viewports" (like `ng-view`s in Angular 1.x's ngRoute)
* Support nested routers
  * Allow components to encapsulate entire parts of an application
* Expose a "navigation model" which can be used to generate a navigation UI (like menus)
  * Expose which route in the model is active (useful in styling/highlighting links in the menu)
* Generate `href`s based on router hierarchies
* Lazy-load components
* Be able to reuse component instances
* Use either push state or hash change mode
* Handle updating the document title


## Prior Art

* [Durandal Router](http://durandaljs.com/documentation/Using-The-Router.html)
* [ngRoute from Angular 1.x](https://docs.angularjs.org/api/ngRoute)
* [Route Recognizer](https://github.com/tildeio/route-recognizer)



## License
Apache 2
