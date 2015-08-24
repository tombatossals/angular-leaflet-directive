define([], function() {
  "use strict";
  var Pipeline = function Pipeline() {
    this.steps = [(function(instruction) {
      return instruction.router.makeDescendantRouters(instruction);
    }), (function(instruction) {
      return instruction.router.canDeactivatePorts(instruction);
    }), (function(instruction) {
      return instruction.router.traversePorts((function(port, name) {
        return boolToPromise(port.canActivate(instruction.viewports[name]));
      }));
    }), (function(instruction) {
      return instruction.router.activatePorts(instruction);
    })];
  };
  ($traceurRuntime.createClass)(Pipeline, {process: function(instruction) {
      var steps = this.steps.slice(0);
      function processOne(result) {
        if (steps.length === 0) {
          return result;
        }
        var step = steps.shift();
        return Promise.resolve(step(instruction)).then(processOne);
      }
      return processOne();
    }}, {});
  function boolToPromise(value) {
    return value ? Promise.resolve(value) : Promise.reject();
  }
  return {
    get Pipeline() {
      return Pipeline;
    },
    __esModule: true
  };
});
