let Tools = require("./tools.js");

// (object, object) => object
function create(library, node) {
    return Tools.instance({
        node,
        children: node.children.map(child => library.createWrap(child))
    }, {
        renderToString,
        mount,
        unmount
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    let node = $.node;
    let s1 = `<${node.type}${renderPropsToString(node.props)}>`;
    if (Tools.isVoidElement(node.type)) {
        return Tools.format(s1, indent, level);
    }
    let s3 = `</${node.type}>`;
    if (node.children.length === 0) {
        return Tools.format(s1 + s3, indent, level);
    }
    let s2;
    if (node.children.length === 1 && node.children[0].type === "#") {
        s2 = $.children[0].renderToString(0, 0);
        return Tools.format(s1 + s2 + s3, indent, level);
    }
    s1 = Tools.format(s1, indent, level);
    s2 = renderChildrenToString($.children, indent, level);
    s3 = Tools.format(s3, indent, level);
    return s1 + s2 + s3;
}

// (object, object) => void
function mount($, domNode) {
    // TODO
}

// object => void
function unmount($) {
    // TODO
}

// object => string
function renderPropsToString(props) {
    return Object.keys(props).reduce((acc, key) => {
        let value = props[key];
        if (Tools.isVoid(value)) {
            return acc;
        }
        if (typeof value === "function") {
            return acc;
        }
        value = Tools.esc(value + "");
        return `${acc} ${key}="${value}"`
    }, "");
}

// (array, number, number) => string
function renderChildrenToString(children, indent, level) {
    return children.reduce(
        (acc, child) => acc + child.renderToString(indent, level + 1),
        ""
    );
}

module.exports = {
    create
};
