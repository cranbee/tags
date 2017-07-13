let Tools = require("./tools.js");

// (object, object) => object
function create(library, rawNode) {
    return Tools.instance({
        library,
        ctx: library.initTag(rawNode.type, rawNode.props, rawNode.children)
    }, {
        renderToString,
        mount,
        unmount
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    let rawNode = $.library.renderTag($.ctx);
    let node = $.library.createNode(rawNode);
    return node.renderToString(indent, level);
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
