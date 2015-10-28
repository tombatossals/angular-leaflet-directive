# Configuring the Router

This guide shows the many ways to map URLs to components.

A router takes an array of pairings like this:

```js
MyController.$routeConfig = [
  { path: '/user', component: 'user' }
];
```

## Sibling Viewports

You can configure multiple viewports on the same path like this:

```js
MyController.$routeConfig = [
  { path: '/user',
    components: {
      master: 'userList',
      detail: 'user'
  } }
];
```

```html
<div ng-viewport="master"></div>
<div ng-viewport="detail"></div>
```

You can link to any sibling just as you normally would:

```html
<p>These both link to the same view:</p>
<a ng-link="userList">link to userList</a>
<a ng-link="user">link to user component</a>
```

Or, you can explicitly link to a viewport-component pair link this:


```html
<p>These both link to the same view:</p>
<a ng-link="master:userList">link to userList</a>
<a ng-link="detail:user">link to user component</a>
```

## redirectTo

Useful for migrating to a new URL scheme and setting up default routes.

With the following configuration:

```js
MyController.$routeConfig = [
  { path: '/', redirectTo: '/user' },
  { path: '/user', component: 'user' }
];
```

A navigation to `/` will result in the URL changing to `/user` and the viewport at that level loading the `user` component.

## Aliases

Consider the following route configuration:

```js
MyController.$routeConfig = [
  { path: '/', component: 'user' }
];
```

When linking to a route, you normally use the name of the component:

```html
<a ng-link="user">link to user component</a>
```

If you want to refer to it differently...


```js
MyController.$routeConfig = [
  { path: '/', component: 'user', as: 'myUser' }
];
```

```html
<a ng-link="myUser">link to user component</a>
```

This can be useful in cases where you have sibling components, but want to refer to that entire level of routing:

```js
MyController.$routeConfig = [
  { path: '/',
    components: {
      master: 'userList',
      detail: 'user'
    },
    as: 'myUser'
  }
];
```
