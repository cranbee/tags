let Tools = require("./tools.js");

// (object, object) => object
function create(library, node) {
    return Tools.instance({
        library,
        ctx: library.initTag(node)
    }, {
        renderToString,
        mount,
        unmount
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    let node = $.library.renderTag($.ctx);
    let wrap = $.library.createWrap(node);
    return wrap.renderToString(indent, level);
}

// (object, object) => void
function mount($, domNode) {
    // TODO
}

// object => void
function unmount($) {
    // TODO
}

module.exports = {
    create
};
