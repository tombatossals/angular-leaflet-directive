// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
var package = new Package('router', [
  require('dgeni-packages/jsdoc'),
  require('dgeni-packages/nunjucks'),
  require('./traceur-package')
]);

package.processor(require('./processors/markdown.js'));
package.processor(require('./processors/generateIndexPage.js'));
package.processor(require('./processors/addMethodsToService.js'));

package.factory(require('./file-readers/markdown'));

// Configure our dgeni-example package. We can ask the Dgeni dependency injector
// to provide us with access to services and processors that we wish to configure
package.config(function(log, readFilesProcessor, templateFinder, templateEngine, writeFilesProcessor, markdownFileReader) {

  // Set logging level
  log.level = 'info';

  // Specify the base path used when resolving relative paths to source and output files
  readFilesProcessor.basePath = path.resolve(__dirname, '..');
  readFilesProcessor.fileReaders.push(markdownFileReader);

  // Specify collections of source files that should contain the documentation to extract
  readFilesProcessor.sourceFiles = [
    { include: 'src/**/*.js', basePath: 'src' },
    { include: 'docs/content/**/*.md', basePath: 'docs/content' },
    { include: 'src/**/*.ats', basePath: 'src' }
  ];


  // Nunjucks and Angular conflict in their template bindings so change the Nunjucks
  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };

  templateEngine.filters.push(require('./rendering/relativeLinkInlineTag'));
  templateEngine.filters.push(require('./rendering/docTypeLabel'));

  // Add a folder to search for our own templates to use when rendering docs
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  // Specify how to match docs to templates.
  // In this case we just use the same static template for all docs
  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.id }.${ doc.docType }.template.html',
    '${ doc.id }.template.html',
    '${ doc.docType }.template.html',
    'common.template.html'
  ];

  // Specify where the writeFilesProcessor will write our generated doc files
  writeFilesProcessor.outputFolder  = 'dist/docs';
}).
config(function(computeIdsProcessor) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['markdown'],
    getId: function(doc) {
      docPath = path.dirname(doc.fileInfo.relativePath);
      if ( doc.fileInfo.baseName !== 'index' ) {
        docPath = path.join(docPath, doc.fileInfo.baseName);
      }
      return docPath;
    },
    getAliases: function(doc) {
      return [doc.id];
    }
  });
}).
config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['markdown'],
    pathTemplate: '${id}',
    outputPathTemplate: '${path}.html'
  });
});

module.exports = package;
