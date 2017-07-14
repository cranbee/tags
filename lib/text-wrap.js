let Tools = require("./tools.js");

// (object, object) => object
function create(library, node) {
    return Tools.instance({
        text: node.text
    }, {
        renderToString,
        mount,
        unmount
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    return Tools.format(Tools.esc($.text), indent, level);
}

// (object, object) => void
function mount($, domNode) {
    // do nothing
}

// object => void
function unmount($) {
    // do nothing
}

module.exports = {
    create
};
