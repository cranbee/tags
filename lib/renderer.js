let Tools = require("./tools.js");

// (object, string, number) => string
function renderToString(library, tagName, indent = 0) {
    let node = { type: tagName, props: {}, children: [] };
    return renderNode(library, node, indent, 0);
}

// (object, object, number, number) => string
function renderNode(library, node, indent, level) {
    if (node.type === "#") {
        return renderTextNode(library, node, indent, level);
    }
    if (library.hasTag(node.type)) {
        return renderCustomNode(library, node, indent, level);
    }
    return renderStandardNode(library, node, indent, level);
}

// (object, object, number, number) => string
function renderTextNode(library, node, indent, level) {
    return format(Tools.esc(node.text), indent, level);
}

// (object, object, number, number) => string
function renderStandardNode(library, node, indent, level) {
    let s1 = `<${node.type}${renderProps(node.props)}>`;
    if (Tools.isVoidElement(node.type)) {
        return format(s1, indent, level);
    }
    let s3 = `</${node.type}>`;
    if (node.children.length === 0) {
        return format(s1 + s3, indent, level);
    }
    let s2;
    if (node.children.length === 1 && node.children[0].type === "#") {
        s2 = renderTextNode(library, node.children[0], 0, 0);
        return format(s1 + s2 + s3, indent, level);
    }
    s1 = format(s1, indent, level);
    s2 = renderChildren(library, node, indent, level);
    s3 = format(s3, indent, level);
    return s1 + s2 + s3;
}

// (object, object, number, number) => string
function renderCustomNode(library, node, indent, level) {
    let result = library.renderTag(node.type, node.props, node.children);
    return renderNode(library, result, indent, level);
}

// (object, object, number, number) => string
function renderChildren(library, node, indent, level) {
    return node.children.reduce((acc, child) => {
        return acc + renderNode(library, child, indent, level + 1);
    }, "");
}

// object => string
function renderProps(props) {
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

// (string, number, number) => string
function format(str, indent, level) {
    return indent === 0 ? str : " ".repeat(indent * level) + str + "\n";
}

module.exports = {
    renderToString
};
