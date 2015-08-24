define(["assert", 'route-recognizer'], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var assert = $__0.assert;
  var RouteRecognizer = $__2.default;
  var CHILD_ROUTE_SUFFIX = '/*childRoute';
  var Grammar = function Grammar() {
    this.rules = {};
  };
  ($traceurRuntime.createClass)(Grammar, {
    config: function(name, config) {
      if (name === 'app') {
        name = '/';
      }
      if (!this.rules[name]) {
        this.rules[name] = new CanonicalRecognizer(name);
      }
      this.rules[name].config(config);
    },
    recognize: function(url) {
      var componentName = arguments[1] !== (void 0) ? arguments[1] : '/';
      var $__4 = this;
      assert.argumentTypes(url, $traceurRuntime.type.string, componentName, $traceurRuntime.type.any);
      if (typeof url === 'undefined') {
        return;
      }
      var componentRecognizer = this.rules[componentName];
      if (!componentRecognizer) {
        return;
      }
      var context = componentRecognizer.recognize(url);
      if (!context) {
        return;
      }
      var lastContextChunk = context[context.length - 1];
      var lastHandler = lastContextChunk.handler;
      var lastParams = lastContextChunk.params;
      var instruction = {
        viewports: {},
        params: lastParams
      };
      if (lastParams && lastParams.childRoute) {
        var childUrl = '/' + lastParams.childRoute;
        instruction.canonicalUrl = lastHandler.rewroteUrl.substr(0, lastHandler.rewroteUrl.length - (lastParams.childRoute.length + 1));
        forEach(lastHandler.components, (function(componentName, viewportName) {
          instruction.viewports[viewportName] = $__4.recognize(childUrl, componentName);
        }));
        instruction.canonicalUrl += instruction.viewports[Object.keys(instruction.viewports)[0]].canonicalUrl;
      } else {
        instruction.canonicalUrl = lastHandler.rewroteUrl;
        forEach(lastHandler.components, (function(componentName, viewportName) {
          instruction.viewports[viewportName] = {viewports: {}};
        }));
      }
      forEach(instruction.viewports, (function(instruction, componentName) {
        instruction.component = lastHandler.components[componentName];
        instruction.params = lastParams;
      }));
      return instruction;
    },
    generate: function(name, params) {
      var path = '';
      var solution;
      do {
        solution = null;
        forEach(this.rules, (function(recognizer) {
          if (recognizer.hasRoute(name)) {
            path = recognizer.generate(name, params) + path;
            solution = recognizer;
          }
        }));
        if (!solution) {
          return '';
        }
        name = solution.name;
      } while (solution.name !== '/');
      return path;
    }
  }, {});
  Grammar.prototype.recognize.parameters = [[$traceurRuntime.type.string], []];
  var CanonicalRecognizer = function CanonicalRecognizer(name) {
    this.name = name;
    this.rewrites = {};
    this.recognizer = new RouteRecognizer();
  };
  ($traceurRuntime.createClass)(CanonicalRecognizer, {
    config: function(mapping) {
      var $__4 = this;
      if (mapping instanceof Array) {
        mapping.forEach((function(nav) {
          return $__4.configOne(nav);
        }));
      } else {
        this.configOne(mapping);
      }
    },
    getCanonicalUrl: function(url) {
      if (url[0] === '.') {
        url = url.substr(1);
      }
      if (url === '' || url[0] !== '/') {
        url = '/' + url;
      }
      forEach(this.rewrites, function(toUrl, fromUrl) {
        if (fromUrl === '/') {
          if (url === '/') {
            url = toUrl;
          }
        } else if (url.indexOf(fromUrl) === 0) {
          url = url.replace(fromUrl, toUrl);
        }
      });
      return url;
    },
    configOne: function(mapping) {
      var $__4 = this;
      if (mapping.redirectTo) {
        if (this.rewrites[mapping.path]) {
          throw new Error('"' + mapping.path + '" already maps to "' + this.rewrites[mapping.path] + '"');
        }
        this.rewrites[mapping.path] = mapping.redirectTo;
        return;
      }
      if (mapping.component) {
        if (mapping.components) {
          throw new Error('A route config should have either a "component" or "components" property, but not both.');
        }
        mapping.components = mapping.component;
        delete mapping.component;
      }
      if (typeof mapping.components === 'string') {
        mapping.components = {default: mapping.components};
      }
      var aliases;
      if (mapping.as) {
        aliases = [mapping.as];
      } else {
        aliases = mapObj(mapping.components, (function(componentName, viewportName) {
          return viewportName + ':' + componentName;
        }));
        if (mapping.components.default) {
          aliases.push(mapping.components.default);
        }
      }
      aliases.forEach((function(alias) {
        return $__4.recognizer.add([{
          path: mapping.path,
          handler: mapping
        }], {as: alias});
      }));
      var withChild = copy(mapping);
      withChild.path += CHILD_ROUTE_SUFFIX;
      this.recognizer.add([{
        path: withChild.path,
        handler: withChild
      }]);
    },
    recognize: function(url) {
      var canonicalUrl = this.getCanonicalUrl(url);
      var context = this.recognizer.recognize(canonicalUrl);
      if (context) {
        context[0].handler.rewroteUrl = canonicalUrl;
      }
      return context;
    },
    generate: function(name, params) {
      return this.recognizer.generate(name, params);
    },
    hasRoute: function(name) {
      return this.recognizer.hasRoute(name);
    }
  }, {});
  function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  function forEach(obj, fn) {
    Object.keys(obj).forEach((function(key) {
      return fn(obj[key], key);
    }));
  }
  function mapObj(obj, fn) {
    var result = [];
    Object.keys(obj).forEach((function(key) {
      return result.push(fn(obj[key], key));
    }));
    return result;
  }
  return {
    get Grammar() {
      return Grammar;
    },
    __esModule: true
  };
});
