module.exports = function markdownFileReader(log) {
  return {
    name: 'markdownFileReader',
    defaultPattern: /\.md$/,
    getDocs: function(fileInfo) {
      return [{
        docType: 'markdownFile'
      }];
    }
  };
};
