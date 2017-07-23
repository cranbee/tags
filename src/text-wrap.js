let Tools = require("./tools.js");

// (object, object) => object
function create(library, node) {
    return Tools.instance({
        text: node.text,
        domNode: null
    }, {
        renderToString,
        renderToDom,
        mount,
        update,
        unmount
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    return Tools.format(Tools.esc($.text), indent, level);
}

// object => object
function renderToDom($) {
    return document.createTextNode($.text);
}

// (object, object) => undefined
function mount($, domNode) {
    if (domNode.nodeType !== Node.TEXT_NODE) {
        throw Error("Invalid mount for a text node");
    }
    $.domNode = domNode;
}

// (object, object) => undefined
function update($, node) {
    if (node.type !== "#") {
        throw Error("Invalid update for a text node");
    }
    if (node.text !== $.text) {
        $.text = node.text;
        $.domNode.nodeValue = $.text;
    }
}

// object => object
function unmount($) {
    let domNode = $.domNode;
    $.domNode = null;
    return domNode;
}

module.exports = {
    create
};
