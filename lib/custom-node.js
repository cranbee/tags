let Tools = require("./tools.js");

// (object, object) => object
function create(library, rawNode) {
    return Tools.instance({
        library,
        type: rawNode.type,
        props: rawNode.props,
        rawChildren: rawNode.children,
        state: {}
    }, {
        renderToString
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    let rawNode = $.library.renderTag($.type, $.props, $.rawChildren, $.state);
    let node = $.library.createNode(rawNode);
    return node.renderToString(indent, level);
}

module.exports = {
    create
};
