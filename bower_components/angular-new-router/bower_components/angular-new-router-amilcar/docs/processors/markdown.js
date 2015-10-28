var Q = require('q');
var marked = require('marked');
var exec = require('child_process').exec;
var renderer    = new marked.Renderer();
var eshighlight = require('eshighlight');
var hljs = require('highlight.js');
hljs.configure({
  classPrefix: ''
});


// anchors for headings
var prev = {}; // <- this is a dirty hack
renderer.heading = function (text, level) {
  if (level === 1) {
    return '<h1>' + text + '</h1>';
  }

  var escapedText = dashCase(text.trim().replace(/[^\w]+/g, '-'));
  if (level > 2) {
    escapedText = prev[level - 1] + '-' + escapedText;
  }

  escapedText = escapedText.replace(/-{2}/g, '-').replace(/^-/, '');

  prev[level] = escapedText;

  return '<h' + level + ' id="' +
      escapedText +
      '"><a class="anchor" href="#' +
      escapedText +
      '"><span class="header-link"></span></a>' +
      text + '</h' + level + '>';
};

var superCode = renderer.code;
renderer.code = function (code, lang, escaped) {
  // dont wrap dotviz output in a code block
  if (lang === 'dot') {
    return code;
  } else {
    return superCode.apply(this, arguments);
  }
};

var TITLE = /#[ ]?(.+)/;

module.exports = function renderMarkdownProcessor() {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $process: function(docs) {
      return Q.all(docs.map(function(doc) {
        if (doc.docType !== 'markdownFile') {
          return doc;
        }
        return Q.nfcall(markdownize, doc.fileInfo.content).then(
          function (rendered) {
            return {
              fileInfo: doc.fileInfo,
              name: getTitle(doc.fileInfo.content),
              summary: getDescription(doc.fileInfo.content),
              renderedContent: rendered,
              docType: 'markdown'
            };
          },
          function(){
            // Add empty error handler to make
            // sure that EPIPE errors on Travis
            // are not causing the script to exit
          }
        );
      }));
    }
  };
};

function getTitle(md) {
  return md.match(TITLE)[1];
}

function getDescription(md) {
  var first = '';
  md.split('\n').some(function (line) {
    return line.trim().length > 0 && line[0] !== '#' && (first = line);
  });
  return first;
}

function markdownize(str, cb) {
  marked(str, {
    highlight: function (code, lang, callback) {
      if (lang === 'dot') {
        graphvizualize(code, callback);
      } else if (lang === 'js') {
        return callback(null, eshighlight(code));
      } else if (lang) {
        return callback(null, hljs.highlight(lang, code).value);
      } else {
        return callback(null, code);
      }
    },
    renderer: renderer
  }, cb);
}


// make a graphviz thing
function graphvizualize(data, cb) {
  var cp = exec('dot -Tsvg');

  // buffer stdout
  var buf = '';
  cp.stdout.on('data', function (data) {
    buf += data;
  });
  cp.on('error', function () {});
  cp.on('close', function (code) {
    cb(null, code > 0 ? '' : buf);
  });

  // set dot to stdin
  cp.stdin.end(data);
}


function dashCase(str) {
  return str.replace(/([A-Z])/g, function ($1) {
    return '-' + $1.toLowerCase();
  });
}
