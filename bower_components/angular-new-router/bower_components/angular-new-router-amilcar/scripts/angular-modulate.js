'use strict';

var falafel = require('falafel');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var traceur = require('traceur');
var traceurRuntime = fs.readFileSync(__dirname + '/lib/traceur-runtime-custom.js', 'utf8');
var escape = require('escape-regexp');

var TRACEUR_OPTS = {
  "asyncFunctions": true,
  "types": true,
  "typeAssertions": false,
  "annotations": true,
  "modules": "inline"
};

/*
 * recursively inline ONLY these definitions
 */
var MODULE_LOCATIONS = {
  'route-recognizer': 'node_modules/route-recognizer/lib/route-recognizer'
};

/*
 * just add dep, don't try to transpile
 */
var STUB_LOCATIONS = {
  './pipeline': true
};


var TRACEUR_CREATE_CLASS = new RegExp('\\$traceurRuntime\\.(createClass|superCall)', 'g');
function detraceurify (contents) {
  return contents.replace(TRACEUR_CREATE_CLASS, '$1');
}

var IMPORT_RE       = new RegExp("import \\{?(\\w+)\\}? from '(.+)';?", 'g');
var IMPORT_PARTS_RE = new RegExp("import \\{?(\\w+)\\}? from '(.+)';?");
var EXPORT_RE = new RegExp("export (default )?");

function getParts(importStatement) {
  return importStatement.match(IMPORT_PARTS_RE)[1];
}


module.exports = function (opts) {

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // do nothing
    }

    if (file.isBuffer()) {
      var contents = file.contents.toString();
      contents = transform(file.cwd, contents);
      file.contents = new Buffer(contents.toString());
    }

    this.push(file);

    return cb();
  });

  // returning the file stream
  return stream;
};

// console.log("angular.module('ngNewRouter.generated', []);");
// console.log(traceurRuntime);


function transform (dir, contents) {
  var imports = [];

  contents = contents.replace(IMPORT_RE, function (match, obj, includePath) {
    if (!MODULE_LOCATIONS[includePath]) {
      imports.push(match);
      return '';
    }
    var includeFile = path.join(dir, MODULE_LOCATIONS[includePath]);
    console.log(dir, includeFile);
    if (includeFile.substr(-3) !== '.js') {
      includeFile += '.js';
    }
    return 'var ' + obj + '=' + inlineModule(includeFile) + ';';
  });

  var services = imports.map(getParts).map(serviceify);
  contents = traceur.compile(contents, TRACEUR_OPTS);
  return detraceurify(unwrapify(contents, services));
}


function inlineModule (filePath, contents) {
  contents = contents || fs.readFileSync(filePath, 'utf8');

  var dir = path.dirname(filePath);

  var wrap = false;
  contents = contents.replace(EXPORT_RE, function (match) {
    wrap = true;
    return 'return ';
  });
  if (wrap) {
    contents = ['(function(){', contents, '}())'].join('');
  }

  return contents.replace(IMPORT_RE, function (match, obj, includePath) {
    var includeFile = path.join(dir, MODULE_LOCATIONS[includePath] || includePath);
    if (includeFile.substr(-3) !== '.js') {
      includeFile += '.js';
    }
    return 'var ' + obj + '=' + inlineModule(includeFile) + ';';
  });
}


function unwrapify (src, services) {
  return falafel(src, {tolerant: true}, function (node) {
    dollarQify(node) || angularReWrap(node, services);
  }).toString();
}

function angularReWrap (node, services) {
  var decls, decl;
  if (node.type === 'VariableDeclaration' &&
      (decls = node.declarations) && decls.length === 1 &&
      (decl = decls[0]) && decl.id.name.match(/^\$__anon/)) {

    var body = decl.init.callee.body.body;
    var exports = body[body.length - 1];
    body = body.slice(0, -1);
    node.update("\nangular.module('ngNewRouter')" +
      exports.argument.properties.map(function (prop) {
        return angularFactory(serviceify(prop.key.name),
            ['$q'].concat(services),
            traceurRuntime + '\n' +
            body.map(function (body) {
              return body.source();
            }).join('\n') +
            '\nreturn new ' +
            prop.value.body.body[0].argument.name + '(' + services.join(', ') + ');');
      }).join('\n'));
    return true;
  }
  return false;
}

function angularFactory(name, deps, body) {
  return ".factory('" + name + "', [" +
      deps.map(function (service) {
        return "'" + service + "', ";
      }).join('') +
      "function (" + deps.join(', ') + ") {\n" + body + "\n}]);";
}

/*
 * Replace ES6 promises with calls to $q
 *
 * note that this may not be comprehensive
 */
function dollarQify (node) {
  if (node.type === 'NewExpression' && node.callee.name === 'Promise') {
    node.update('$q(' + argsToSrc(node) + ')');
  } else if (node.type === 'CallExpression') {
    var callee = node.callee.source(),
        match,
        method;
    if (match = callee.match(/^Promise\.(resolve|reject|all)$/)) {
      var method = match[1];
      if (method === 'resolve') {
        method = 'when';
      }
      node.update('$q.' + method + '(' + argsToSrc(node) + ')');
    }
  } else {
    return false;
  }
  return true;
}

/*
 * given a node with arguments return the source prepresentation
 */
function argsToSrc (node) {
  return node.arguments.map(function (node) {
    return node.source();
  }).join(', ');
}


function serviceify (name) {
  return '$$' + name[0].toLowerCase() + name.substr(1);
}
