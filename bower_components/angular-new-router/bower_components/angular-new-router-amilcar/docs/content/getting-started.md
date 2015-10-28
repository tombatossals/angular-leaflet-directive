# Getting Started

These are instuctions for starting a new app with the New Router with AngularJS 1.4.

## Project Structure

Make a new directory and `cd` into it.

We'll use `npm init` to setup a new project:

```
npm init
```

You can answer the prompts however you like.

Then we'll install Angular and the New Router:

```
npm install angular angular-new-router
```

Let's make a few other files to get started:

```
touch index.html app.js
```

Your directory should look something like this:

```
app.js
index.html
package.json
node_modules/
└── ...
```


Let's start with the contents of `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <base href="/">
  <title>My app</title>
</head>
<body ng-app="myApp" ng-controller="AppController as app">
  <div ng-viewport></div>

  <script src="/node_modules/angular/angular.js"></script>
  <script src="/dist/router.es5.js"></script>
  <script src="/app/app.js"></script>
</body>
</html>
```

This is a pretty typical angular app, except the `ng-viewport` directive.
`ng-viewport` is like `ng-view`; it's a placeholder for part of your app loaded
dynamically based on the route configuration.

So how do we configure the app? Let's open `app.js` and find out. Add this to the file:

```js
angular.module('app', ['ngNewRouter'])
  .controller('AppController', ['$router', AppController]);

AppController.$routeConfig([
  {path: '/', component: 'home' }
]);
function AppController ($router) {}
```

The `ngNewRouter` module provides a new service, `$router`. You notice in the configuration that
we map paths to components. What's a component? Let's talk about that for a bit.


## Components

In Angular 1, a "routable component" is a template, plus a controller, plus a router.
You can configure how to map component names to controllers and templates in the [$componentLoader]($componentLoaderProvider) service.

<!--
<aside class="implementation detail">
In Angular 2, the DI system understands how to... .

In Angular 1, we need this component system to hook up child routers.
</aside>
-->

A component's template can have "viewports," which are holes in the DOM for loading parts of your app based on the route configuration and its controller can have a router.
A component's router tells the component what to put inside the viewports based on URL.
The configuration maps routes to components for each viewport.

Let's make a `home` component that our app can route to.

```
mkdir -p components/home
touch components/home/home.html components/home/home.js
```

This creates our component directory and it's corresponding files, which is a template and a JavaScript component.

Let's open `home.html` and add some content:

```html
<h1>Hello {{home.name}}!</h1>
```

Components use the "controller as" syntax, so if we want to access property `name` of the controller, we write the binding as `home.name`.

Then, let's make a controller:

```js
angular.module('app.home', [])
  .controller('HomeController', [function () {
    this.name = 'Friend';
  }]);
```

To wire this up, We need to add a `<script>` tag to our `index.html`:

```html
...
<script src="./components/home/home.js"></script>
```

And add the controller's module as a dependency to our main module in `app.js`:

```js
angular.module('app', ['ngNewRouter', 'app.home'])
  .controller('AppController', ['$router', AppController]);
// ...
```

If you load up the app, you should see `Hello Friend!`


## Linking to routes

Let's add another route and then link to it. This route will have a route parameter, `id`.

In app.js:

```js
angular.module('app', ['ngNewRouter'])
  .controller('AppController', ['$router', AppController]);

AppController.$routeConfig = [
  { path: '/',           component: 'home' },
  { path: '/detail/:id', component: 'detail' }
];
function AppController ($router) {}
```

We can link to our `detail` component using the `ng-link` directive.
Add this to `index.html`:

```html
<body ng-app="myApp" ng-controller="AppController as app">
  <a ng-link="detail({id: 5})">link to detail</a>
  ...
```

This directive will handle generating an `href` and updating the URL of the browser.

We should also implement this component. Let's make these new files:

```
mkdir components/detail
touch components/detail/detail.html components/detail/detail.js
```

In `detail.js`, we can implement a controller that uses the `id` route parameter:

```js
angular.module('app.detail', ['ngNewRouter'])
  .controller('DetailController', ['$routeParams', DetailController]);

function DetailController ($routeParams) {
  this.id = $routeParams.id;
}
```

We can display the id in the template by adding this to `detail.html`:

```html
<p>detail {{detail.id}}</p>
```

Then we'd have to wire up the controller by adding a script tag and making out `app` module depend on `app.detail`.


## Additional reading

See the `examples/` directory for common recipes.
