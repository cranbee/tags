let Tools = require("./tools.js");

// (object, object) => object
function create(library, node) {
    let type = node.type;
    let tag = library.getTag(type);
    let ctx = Object.create(library.getCtx());
    ctx.props = prepareProps(node.props);
    ctx.children = node.children;
    ctx.state = {};
    ctx.domNode = null;
    ctx.template = data => library.renderTemplate(type, data);
    if (tag.init) {
        tag.init(ctx);
    }
    return Tools.instance({
        type,
        tag,
        ctx,
        childWrap: library.createWrap(tag.render(ctx))
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
    return $.childWrap.renderToString(indent, level);
}

// object => object
function renderToDom($) {
    return $.childWrap.renderToDom();
}

// (object, object) => undefined
function mount($, domNode) {
    $.ctx.domNode = domNode;
    $.childWrap.mount(domNode);
    if ($.tag.didMount) {
        $.tag.didMount($.ctx);
    }
}

// (object, object) => undefined
function update($, node) {
    if (node.type !== $.type) {
        throw Error(`Invalid update for a "${$.type}" node`);
    }
    $.ctx.props = prepareProps(node.props);
    $.ctx.children = node.children;
    if ($.tag.willUpdate) {
        $.tag.willUpdate($.ctx);
    }
    $.childWrap.update($.tag.render($.ctx));
    if ($.tag.didUpdate) {
        $.tag.didUpdate($.ctx);
    }
}

// object => object
function unmount($) {
    $.childWrap.unmount();
    if ($.tag.willUnmount) {
        $.tag.willUnmount($.ctx);
    }
    let domNode = $.ctx.domNode;
    $.ctx.domNode = null;
    return domNode;
}

// object => object
function prepareProps(props) {
    let preparedProps = {};
    Object.keys(props).forEach(key => {
        preparedProps[Tools.toLowerCamelCase(key)] = props[key];
    });
    return preparedProps;
}

module.exports = {
    create
};
