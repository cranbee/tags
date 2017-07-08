let Tools = require('./tools.js');

// (object, string, object, boolean) => string
function renderToString(library, tagName, props, pretty = false) {
    let node = {
        type: tagName,
        props,
        children: []
    };
    return renderNode(library, node, pretty ? 0 : undefined);
}

// (object, object, number | void) => string
function renderNode(library, node, indent) {
    if (node.type === '#') {
        return renderTextNode(library, node, indent);
    }
    if (library.hasTag(node.type)) {
        return renderCustomNode(library, node, indent);
    }
    return renderStandardNode(library, node, indent);
}

// (object, object, number | void) => string
function renderTextNode(library, node, indent) {
    return format(Tools.esc(node.text), indent);
}

// (object, object, number | void) => string
function renderStandardNode(library, node, indent) {
    let s1 = `<${node.type}${renderProps(node.props)}>`;
    if (Tools.isVoidElement(node.type)) {
        return format(s1, indent);
    }
    let s3 = `</${node.type}>`;
    if (node.children.length === 0) {
        return format(s1 + s3, indent);
    }
    let s2;
    if (node.children.length === 1 && node.children[0].type === '#') {
        s2 = renderTextNode(library, node.children[0]);
        return format(s1 + s2 + s3, indent);
    }
    s1 = format(s1, indent);
    s2 = renderChildren(library, node, indent);
    s3 = format(s3, indent);
    return s1 + s2 + s3;
}

// (object, object, number | void) => string
function renderCustomNode(library, node, indent) {
    let result = library.renderTag(node.type, node.props, node.children);
    return renderNode(library, result, indent);
}

// (object, object, number | void) => string
function renderChildren(library, node, indent) {
    let childIndent = Tools.isVoid(indent) ? undefined : indent + 1;
    return node.children.reduce((acc, child) => {
        return acc + renderNode(library, child, childIndent);
    }, '');
}

// object => string
function renderProps(props) {
    return Object.keys(props).reduce((acc, key) => {
        let value = props[key];
        if (Tools.isVoid(value)) {
            return acc;
        }
        if (typeof value === 'function') {
            return acc;
        }
        value = Tools.esc(value + '');
        return `${acc} ${key}="${value}"`
    }, '');
}

// (string, number | void) => string
function format(str, indent) {
    return Tools.isVoid(indent) ? str : ' '.repeat(indent * 2) + str + '\n';
}

module.exports = {
    renderToString
};
