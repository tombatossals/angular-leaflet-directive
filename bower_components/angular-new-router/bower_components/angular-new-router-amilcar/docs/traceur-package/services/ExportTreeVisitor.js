module.exports = function ExportTreeVisitor(ParseTreeVisitor, log) {

  function ExportTreeVisitorImpl() {
    ParseTreeVisitor.call(this);
  }
  ExportTreeVisitorImpl.prototype = Object.create(ParseTreeVisitor.prototype);

  ExportTreeVisitorImpl.prototype.visitExportDeclaration = function(tree) {
    // We are entering an export declaration - create an object to track it
    this.currentExport = {
      comment: tree.commentBefore,
      location: tree.location
    };
    log.silly('enter', tree.type, tree.commentBefore ? 'has comment' : '');
    ParseTreeVisitor.prototype.visitExportDeclaration.call(this, tree);
    log.silly('exit', this.currentExport);

    // We are exiting the export declaration - store the export object
    this.exports.push(this.currentExport);
    this.currentExport = null;
  };


  ExportTreeVisitorImpl.prototype.visitVariableStatement = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);
      this.currentExport.name = "VARIABLE_STATEMENT";
    }
  };


  ExportTreeVisitorImpl.prototype.visitVariableDeclaration = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);
      this.currentExport.name = tree.lvalue;
      this.currentExport.variableDeclaration = tree;
    }
  };


  ExportTreeVisitorImpl.prototype.visitFunctionDeclaration = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);
      this.currentExport.name = tree.name.identifierToken.value;
      this.currentExport.functionKind = tree.functionKind;
      this.currentExport.parameters = tree.parameterList.parameters;
      this.currentExport.typeAnnotation = tree.typeAnnotation;
      this.currentExport.annotations = tree.annotations;
      this.currentExport.docType = 'function';

      log.silly(tree.type, tree.commentBefore ? 'has comment' : '');
    }
  };


  ExportTreeVisitorImpl.prototype.visitClassDeclaration = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);
      this.currentExport.name = tree.name.identifierToken.value;
      this.currentExport.superClass = tree.superClass;
      this.currentExport.annotations = tree.annotations;
      this.currentExport.elements = tree.elements;
      this.currentExport.docType = 'class';
    }
  };


  ExportTreeVisitorImpl.prototype.visitAsyncFunctionDeclaration = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);
    }
  };


  ExportTreeVisitorImpl.prototype.visitExportDefault = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);
      this.currentExport.name = 'DEFAULT';
      this.currentExport.defaultExport = tree;
      // Default exports are either classes, functions or expressions
      // So we let the super class continue down...
      ParseTreeVisitor.prototype.visitExportDefault.call(this, tree);
    }
  };


  ExportTreeVisitorImpl.prototype.visitNamedExport = function(tree) {
    if ( this.currentExport ) {
      this.updateExport(tree);

      this.currentExport.namedExport = tree;
      this.currentExport.name = 'NAMED_EXPORT';
      // TODO: work out this bit!!
      // We need to cope with any export specifiers in the named export
    }
  };


  // TODO - if the export is an expression, find the thing that is being
  // exported and use it and its comments for docs

  ExportTreeVisitorImpl.prototype.updateExport = function(tree) {
    this.currentExport.comment = this.currentExport.comment || tree.commentBefore;
    this.currentExport.docType = tree.type;
  };

  ExportTreeVisitorImpl.prototype.visit = function(tree) {
    this.exports = [];
    ParseTreeVisitor.prototype.visit.call(this, tree);
  };

  return ExportTreeVisitorImpl;
};