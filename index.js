let Library = require('./lib/library.js');
let Renderer = require('./lib/renderer.js');

module.exports = {
    library: Library.create,
    renderToString: Renderer.renderToString
};
