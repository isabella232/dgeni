var myArgs = require('optimist')
  .usage('Usage: $0 path/to/files --templates=path/to/templates --output=path/to/output/folder')
  .demand(1)
  .argv;

var filePath = myArgs._[0];
var setup = require('./lib/default-setup');

// Doc rendering
var docRendererFactory = require('../lib/doc-renderer');
var renderDoc = docRendererFactory(myArgs.templates, myArgs.output);

// Main work
console.log('Reading files from ', filePath);
setup.readFiles(filePath)
  .then(function(docs) {
    console.log('Read', docs.length, 'docs');
    docs.forEach(function(doc) {
      setup.processDoc(doc);
      console.log('Processed doc', doc.id);
    });
    docs = setup.mergeDocs(docs);
    docs.forEach(function(doc) {
      var renderedFilePath = renderDoc('partial.html', doc);
      console.log('Rendered doc', renderedFilePath);
    });
  }).done();