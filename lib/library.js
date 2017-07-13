let CustomNode = require("./custom-node.js");
let StandardNode = require("./standard-node.js");
let Template = require("@cranbee/template");
let TextNode = require("./text-node.js");
let Tools = require("./tools.js");

// object => object
function create(ctx = {}) {
    let $ = {
        ctx,
        tags: {},
        templates: {}
    };
    let extApi = Tools.instance($, {
        addTag,
        renderToString
    });
    let intApi = Tools.instance($, {
        createNode,
        hasTag,
        initTag,
        renderTag
    });
    $.intApi = intApi;
    return extApi;
}

// (object, string, object, array | void) => void
function addTag($, type, tag, template) {
    $.tags[type] = tag;
    $.templates[type] = template;
}

// (object, string, number) => string
function renderToString($, type, indent = 0) {
    let rawNode = { type, props: {}, children: [] };
    let node = createNode($, rawNode);
    return node.renderToString(indent, 0);
}

// (object, object) => object
function createNode($, rawNode) {
    if (rawNode.type === "#") {
        return TextNode.create($.intApi, rawNode);
    }
    if (hasTag($, rawNode.type)) {
        return CustomNode.create($.intApi, rawNode);
    }
    return StandardNode.create($.intApi, rawNode);
}

// (object, string) => boolean
function hasTag($, type) {
    return !!$.tags[type];
}

// (object, string, object, array) => object
function initTag($, type, props, children) {
    let ctx = Object.assign({}, $.ctx);
    ctx.type = type;
    ctx.props = prepareProps(props);
    ctx.children = children;
    ctx.template = data => renderTemplate($, type, data);
    if ($.tags[type].init) {
        $.tags[type].init(ctx);
    }
    return ctx;
}

// (object, string, object) => object
function renderTag($, ctx) {
    let result = $.tags[ctx.type].render(ctx);
    return Array.isArray(result) ? result[0] : result;
}

// (object, string, object) => array
function renderTemplate($, type, data) {
    return Template.execute($.templates[type], data);
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
