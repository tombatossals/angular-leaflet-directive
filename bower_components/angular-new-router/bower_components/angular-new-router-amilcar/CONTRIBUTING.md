# Contributing

This doc explains how The New Router is developed, and how you can help improve it.

## Methodology

You can see daily progress and goals in the [progress doc](https://docs.google.com/document/d/1-DBXTHaeec6XH5qx2tKVrgrjiILy76_lSrjgJv95RJ4/edit#).
Individual tasks are mostly tracked as issues on GitHub.

### Giving Feedback

Please check existing issues and PRs (including ones that have already been closed) before filing new ones.
That being said, all forms of feedback are welcome: bug reports, feature requests, use cases, and questions.

### GitHub Labels
Most of the use cases are self-explanatory, so they are omitted.

* [pair](https://github.com/angular/router/labels/pair) - issues that @btford wants to use or pairing with other Angular Core team members to get feedback.
* [`type: use case`](https://github.com/angular/router/labels/type%3A%20use%20case) - issues that describe a common usage scenario.
  Should be closed by adding an example to `examples/angular-1/`, complete with docs and an e2e test.

### GitHub Milestones
* v0.x.y - This is the list of tasks that I'm aiming to get done this week. I'll be closing these and cutting releases on Fridays.
* [pre ng-conf](https://github.com/angular/router/issues?q=milestone%3Apre-ng-conf+) - these tasks need to be taken care of before the beginning of March.
* [post ng-conf](https://github.com/angular/router/issues?q=milestone%3A%22post+ng-conf%22) - these tasks need to be taken care of eventually.

After ng-conf, I'll likely reorganize these labels.


## Releases

Releases of this module live in the `dist` directory. Releases (tagged `vx.y.z`) of this module published on npm
or will have up-to-date build artifacts checked in.


## Development

This section explains how to build the router module yourself.

### Setup

This doc explains how to build the router module yourself.

1. Install [NodeJS](http://nodejs.org/)
2. Install [Gulp](http://gulpjs.com/) with `npm install -g gulp`
3. Clone and `cd` into this repo.
4. Install dependencies with `npm install` and `bower install`

### Running the Examples

1. Start the development server with `gulp build watch serve`
2. Open a browser and navigate to [http://localhost:8000/examples/angular-1/hello](http://localhost:8000/examples/angular-1/hello)

### Running the Tests

1. Install [Karma](http://karma-runner.github.io/) with `npm install -g karma`
2. Install the CLI for [Karma](http://karma-runner.github.io/) with `npm install -g karma-cli`
3. Start karma with `karma start`
4. Add new tests to the `test` folder. Be sure to give them an extension of `.spec.js`.
