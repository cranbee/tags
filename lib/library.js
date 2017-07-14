let CustomWrap = require("./custom-wrap.js");
let StandardWrap = require("./standard-wrap.js");
let Template = require("@cranbee/template");
let TextWrap = require("./text-wrap.js");
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
        createWrap,
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
    let node = { type, props: {}, children: [] };
    let wrap = createWrap($, node);
    return wrap.renderToString(indent, 0);
}

// (object, object) => object
function createWrap($, node) {
    if (node.type === "#") {
        return TextWrap.create($.intApi, node);
    }
    if (hasTag($, node.type)) {
        return CustomWrap.create($.intApi, node);
    }
    return StandardWrap.create($.intApi, node);
}

// (object, string) => boolean
function hasTag($, type) {
    return !!$.tags[type];
}

// (object, object) => object
function initTag($, node) {
    let ctx = Object.assign({}, $.ctx);
    ctx.type = node.type;
    ctx.props = prepareProps(node.props);
    ctx.children = node.children;
    ctx.template = data => renderTemplate($, ctx.type, data);
    if ($.tags[ctx.type].init) {
        $.tags[ctx.type].init(ctx);
    }
    return ctx;
}

// (object, object) => object
function renderTag($, ctx) {
    return $.tags[ctx.type].render(ctx);
}

// (object, string, object) => object
function renderTemplate($, type, data) {
    let result = Template.execute($.templates[type], data);
    if (result.length !== 1) {
        throw Error(`Template "${type}" should be rendered to a single node`);
    }
    return result[0];
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
