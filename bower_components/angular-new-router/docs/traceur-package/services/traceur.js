var traceur = require('traceur/src/node/traceur.js');

module.exports = {

  traceurOptions: function traceurOptions() {
    return traceur.options;
  },

  // We have to jump through some syntactic hoops to get classes out of
  // Traceur for use in ES5 node apps
  getClass: function(id, path) {
    path = System.map.traceur + (path || ('/src/syntax/' + id));
    var factory = function() {
      return System.get(path)[id];
    };
    factory.name = id;
    return factory;
  }
};
