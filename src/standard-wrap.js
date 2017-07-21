let Tools = require("./tools.js");

// (object, object) => object
function create(library, node) {
    return Tools.instance({
        library,
        node,
        childWraps: node.children.map(library.createWrap),
        domNode: undefined
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
    let attrs = getAttrs($.node.props);
    let s1 = `<${$.node.type}${renderAttrsToString(attrs)}>`;
    if (Tools.isVoidElement($.node.type)) {
        return Tools.format(s1, indent, level);
    }
    let s3 = `</${$.node.type}>`;
    if ($.node.children.length === 0) {
        return Tools.format(s1 + s3, indent, level);
    }
    let s2;
    if ($.node.children.length === 1 && $.node.children[0].type === "#") {
        s2 = $.childWraps[0].renderToString(0, 0);
        return Tools.format(s1 + s2 + s3, indent, level);
    }
    s1 = Tools.format(s1, indent, level);
    s2 = $.childWraps.map(x => x.renderToString(indent, level + 1)).join("");
    s3 = Tools.format(s3, indent, level);
    return s1 + s2 + s3;
}

// object => object
function renderToDom($) {
    let domNode = document.createElement($.node.type);
    let attrs = getAttrs($.node.props);
    Object.keys(attrs).forEach(key => {
        let value = attrs[key];
        if (value === true) {
            domNode.setAttribute(key, key);
        } else if (!Tools.isVoid(value) && value !== false) {
            domNode.setAttribute(key, value);
        }
    });
    $.childWraps.forEach(childWrap => {
        domNode.appendChild(childWrap.renderToDom());
    });
    return domNode;
}

// (object, object) => void
function mount($, domNode) {
    if (domNode.nodeType !== Node.ELEMENT_NODE) {
        throw Error(`Invalid mount for a "${$.node.type}" node`);
    }
    let tagName = domNode.tagName.toLowerCase();
    if (tagName !== $.node.type) {
        throw Error(`Invalid mount for a "${$.node.type}" node`);
    }
    let events = getEvents($.node.props);
    Object.keys(events).forEach(eType => {
        domNode.addEventListener(eType, events[eType]);
    });
    let childDomNodes = domNode.childNodes;
    if ($.childWraps.length !== childDomNodes.length) {
        throw Error(`Invalid mount for a "${$.node.type}" node`);
    }
    $.childWraps.forEach((childWrap, index) => {
        childWrap.mount(childDomNodes[index]);
    });
    $.domNode = domNode;
}

// (object, object) => void
function update($, node) {
    if (node.type !== $.node.type) {
        throw Error(`Invalid update for a "${$.node.type}" node`);
    }
    updateAttrs($, node);
    updateEvents($, node);
    updateChildren($, node);
    $.node = node;
}

// object => object
function unmount($) {
    let domNode = $.domNode;
    $.domNode = undefined;
    return domNode;
}

// (object, object) => void
function updateAttrs($, node) {
    let attrs1 = getAttrs($.node.props);
    let attrs2 = getAttrs(node.props);
    Object.keys(attrs2).forEach(key => {
        let v1 = attrs1[key];
        let v2 = attrs2[key];
        if (v1 === v2) {
            return;
        }
        if (Tools.isVoid(v2) || v2 === false) {
            $.domNode.removeAttribute(key);
        } else if (v2 === true) {
            $.domNode.setAttribute(key, key);
        } else {
            $.domNode.setAttribute(key, v2);
        }
    });
}

// (object, object) => void
function updateEvents($, node) {
    let events1 = getEvents($.node.props);
    let events2 = getEvents(node.props);
    Object.keys(events2).forEach(key => {
        let h1 = events1[key];
        let h2 = events2[key];
        if (h1 === h2) {
            return;
        }
        if (h1) {
            $.domNode.removeEventListener(key, h1);
        }
        if (h2) {
            $.domNode.addEventListener(key, h2);
        }
    });
}

// (object, object) => void
function updateChildren($, node) {
    // Prepare:
    let children1 = $.node.children;
    let children2 = node.children;
    let n1 = children1.length;
    let n2 = children2.length;
    let min = Math.min(n1, n2);
    // Update nodes:
    for (let i = 0; i < min; i++) {
        let node1 = children1[i];
        let node2 = children2[i];
        let key1 = node1.props ? node1.props.key : undefined;
        let key2 = node2.props ? node2.props.key : undefined;
        let wrap = $.childWraps[i];
        if (node1.type === node2.type && key1 === key2) {
            wrap.update(node2);
        } else {
            let domNode1 = wrap.unmount();
            wrap = $.library.createWrap(node2);
            $.childWraps[i] = wrap;
            let domNode2 = wrap.renderToDom();
            $.domNode.replaceChild(domNode2, domNode1);
            wrap.mount(domNode2);
        }
    }
    // Add nodes:
    for (let i = n1; i < n2; i++) {
        let node = children2[i];
        let wrap = $.library.createWrap(node);
        $.childWraps.push(wrap);
        let domNode = wrap.renderToDom();
        $.domNode.appendChild(domNode);
        wrap.mount(domNode);
    }
    // Remove nodes:
    for (let i = n2; i < n1; i++) {
        let wrap = $.childWraps[i];
        let domNode = wrap.unmount();
        $.domNode.removeChild(domNode);
    }
    if (n1 > n2) {
        $.childWraps.splice(n2, n1 - n2);
    }
}

// object => object
function getAttrs(props) {
    let attrs = {};
    Object.keys(props).forEach(key => {
        if (key === "key") {
            return;
        }
        if (key === "ref") {
            return;
        }
        if (key.startsWith("on-")) {
            return;
        }
        attrs[key] = props[key];
    });
    return attrs;
}

// object => object
function getEvents(props) {
    let events = {};
    Object.keys(props).forEach(key => {
        if (key.startsWith('on-')) {
            events[key.substr(3)] = props[key];
        }
    });
    return events;
}

// object => string
function renderAttrsToString(attrs) {
    let pairs = Object.keys(attrs).map(key => {
        if (Tools.isVoid(attrs[key])) {
            return "";
        }
        if (attrs[key] === false) {
            return "";
        }
        if (attrs[key] === true) {
            return " " + key;
        }
        let value = Tools.esc(attrs[key] + "");
        return ` ${key}="${value}"`
    });
    return pairs.join("");
}

module.exports = {
    create
};
