module.exports = function AttachCommentTreeVisitor(ParseTreeVisitor, log) {


  // This visitor tries to find the nearest comment for each code node and attaches them
  // to the relevant nodes in the AST

  function AttachCommentTreeVisitorImpl() {
    ParseTreeVisitor.call(this);
  }
  AttachCommentTreeVisitorImpl.prototype = Object.create(ParseTreeVisitor.prototype);
  AttachCommentTreeVisitorImpl.prototype.constructor = AttachCommentTreeVisitorImpl;


  AttachCommentTreeVisitorImpl.prototype.visit = function(tree, comments) {
    this.comments = comments;
    this.index = 0;
    this.currentComment = this.comments[this.index];

    if (this.currentComment) log.silly('comment: ' +
        this.currentComment.range.start.line + ' - ' +
        this.currentComment.range.end.line);

    ParseTreeVisitor.prototype.visit.call(this, tree);
  };


  AttachCommentTreeVisitorImpl.prototype.visitAny = function(tree) {
    if (tree && tree.location && tree.location.start && this.currentComment) {
      if (this.currentComment.range.end.offset < tree.location.start.offset) {
        log.silly('tree: ' + tree.constructor.name + ' - ' + tree.location.start.line);
        tree.commentBefore = this.currentComment;
        this.currentComment.treeAfter = tree;
        this.index++;
        this.currentComment = this.comments[this.index];
        if (this.currentComment) log.silly('comment: ' + this.currentComment.range.start.line + ' - ' + this.currentComment.range.end.line);
      }
    }
    return ParseTreeVisitor.prototype.visitAny.call(this, tree);
  };

  return AttachCommentTreeVisitorImpl;
};