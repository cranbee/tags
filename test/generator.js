let FS = require('fs');
let Library = require('./library.js');
let Tags = require('../index.js');

// () => void
function main() {
    let library = Library.create();
    let html = Tags.renderToString(library, 'x-products', {}, true);
    FS.writeFileSync(`${__dirname}/sample.html`, html);
    console.log('sample.html was generated');
}

main();
