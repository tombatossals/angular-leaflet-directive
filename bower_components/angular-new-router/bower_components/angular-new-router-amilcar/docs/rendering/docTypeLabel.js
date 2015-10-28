var path = require('canonical-path');

var LABELS = {
  markdown: 'Guide',
  provider: 'Provider',
  directive: 'Directive',
  module: 'Module',
  js: 'API'
};

module.exports = {
  name: 'docTypeLabel',
  process: function(docType) {
    return LABELS[docType];
  }
};
