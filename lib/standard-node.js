let Tools = require("./tools.js");

// (object, object) => object
function create(library, rawNode) {
    return Tools.instance({
        type: rawNode.type,
        props: rawNode.props,
        children: rawNode.children.map(child => library.createNode(child)),
        rawChildren: rawNode.children
    }, {
        renderToString
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    let s1 = `<${$.type}${renderPropsToString($.props)}>`;
    if (Tools.isVoidElement($.type)) {
        return Tools.format(s1, indent, level);
    }
    let s3 = `</${$.type}>`;
    if ($.children.length === 0) {
        return Tools.format(s1 + s3, indent, level);
    }
    let s2;
    if ($.children.length === 1 && $.rawChildren[0].type === "#") {
        s2 = $.children[0].renderToString(0, 0);
        return Tools.format(s1 + s2 + s3, indent, level);
    }
    s1 = Tools.format(s1, indent, level);
    s2 = renderChildrenToString($.children, indent, level);
    s3 = Tools.format(s3, indent, level);
    return s1 + s2 + s3;
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
