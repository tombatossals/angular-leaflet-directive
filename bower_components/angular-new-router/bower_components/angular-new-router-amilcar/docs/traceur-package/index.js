var Package = require('dgeni').Package;
var traceur = require('./services/traceur');
var path = require('canonical-path');

module.exports = new Package('traceur')

.factory(require('./readers/atScript'))
.factory(require('./services/getJSDocComment'))

// Create injectable services from traceur classes and objects
.factory(traceur.traceurOptions)
.factory('SourceFile', traceur.getClass('SourceFile'))
.factory('ParseTreeVisitor', traceur.getClass('ParseTreeVisitor'))
.factory('Parser', traceur.getClass('Parser'))

// This is the main wrapper around traceur that parses the content of ats files
.factory(require('./services/atParser'))

// Create tree visitor services that are used to extract info from the ASTs
.factory(require('./services/AttachCommentTreeVisitor'))
.factory(require('./services/ExportTreeVisitor'))


// Processors
.processor(require('./processors/generateDocsFromComments'))
.processor(require('./processors/processModuleDocs'))
.processor(require('./processors/processClassDocs'))


// Configure file reader
.config(function(readFilesProcessor, atScriptFileReader) {
  readFilesProcessor.fileReaders.push(atScriptFileReader);
})


// Configure templates
.config(function(templateFinder) {
  templateFinder.templateFolders.push(path.resolve(__dirname, 'templates'));
})

// Configure ids and paths
.config(function(computeIdsProcessor, computePathsProcessor) {

  computeIdsProcessor.idTemplates.push({
    docTypes: [
      'class',
      'function',
      'NAMED_EXPORT',
      'VARIABLE_STATEMENT'
    ],
    idTemplate: '${moduleDoc.id}.${name}',
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['member'],
    idTemplate: '${classDoc.id}.${name}',
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['guide'],
    getId: function(doc) {
      return doc.fileInfo.relativePath
                    // path should be relative to `modules` folder
                    .replace(/.*\/?modules\//, '')
                    // path should not include `/docs/`
                    .replace(/\/docs\//, '/')
                    // path should not have a suffix
                    .replace(/\.\w*$/, '');
    },
    getAliases: function(doc) { return [doc.id]; }
  });


  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    pathTemplate: '${id}',
    getOutputPath: function() {} // don't write this to file
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: [
      'class',
      'function',
      'NAMED_EXPORT',
      'VARIABLE_STATEMENT'
    ],
    pathTemplate: '${name}',
    outputPathTemplate: '${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['member'],
    pathTemplate: '${classDoc.path}/${name}',
    getOutputPath: function() {} // These docs are not written to their own file, instead they are part of their class doc
  });
});
