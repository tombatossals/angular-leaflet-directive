# Architecture

This is a rough WIP notes doc.


## Child Routers

* useful for "settings"
* enterprise apps



## Pipeline

- kinda like middleware

1. select controller
  - ask current controller if it can
1. select view
1. activate instruction
  - can do scaffolding (maybe)

redirects:
- how do we handle circular requests?



## "Screen Activator"

The router understands the notion of "screen activation" for components, enabling them to allow/reject navigation into or out of a component.

- prevent to/from a "screen" (view/viewport)
- "separate query from command" (can I versus how do I navigate)
- helpful abstraction for heirarchies
  - think "master->detail"
  - 3 levels of routers

* Lifecycle hooks include: `canActivate`, `activate`, `canDeactivate` and `deactivate`.
* These hooks understand promises, as well as a few other "primitives" (for instance a `Redirect` command object).
* You can "teach" the activation mechanism about new primitives.
* The router uses the activator mechanism to pass parameters to a component. The `canActivate` and `activate` callbacks recieve the route parameters, parsed query string parameters and route config which they can use to control navigation or load model data.


## Implementation Details

* Uses the [route-recognizer.js](https://github.com/tildeio/route-recognizer) library to match routes. This allows for static routes, named parameters, splats and query strings.

* Uses a consistent async programming model with promises.

* The async pipeline pulls from an internal instruction queue which handles "overlapping" route requests common in async scenarios. There are hooks provided to tap into the internal instruction data and control what the router is doing.

* Fully integrated with DI. In particular, this helps set up child router scenarios.

* Supports manipulating history for replacing, with or without triggering a route activation.




[screen conductor]: http://caliburnmicro.codeplex.com/wikipage?title=Screens%2c%20Conductors%20and%20Composition&referringTitle=Documentation
[screen activator]: http://codebetter.com/jeremymiller/2009/09/07/screen-activator-pattern/
