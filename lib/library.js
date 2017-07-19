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
        renderToString,
        mount
    });
    let intApi = Tools.instance($, {
        getCtx,
        getTag,
        renderTemplate,
        createWrap
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

// (object, string, object) => (() => void)
function mount($, type, domNode) {
    let node = { type, props: {}, children: [] };
    let wrap = createWrap($, node);
    wrap.mount(domNode);
    return () => wrap.update(node);
}

// object => object
function getCtx($) {
    return $.ctx;
}

// (object, string) => object | void
function getTag($, type) {
    return $.tags[type];
}

// (object, string, object) => object
function renderTemplate($, type, data) {
    let result = Template.execute($.templates[type], data);
    if (result.length !== 1) {
        throw Error(`Template "${type}" should be rendered to a single node`);
    }
    return result[0];
}

// (object, object) => object
function createWrap($, node) {
    if (node.type === "#") {
        return TextWrap.create($.intApi, node);
    }
    if ($.tags[node.type]) {
        return CustomWrap.create($.intApi, node);
    }
    return StandardWrap.create($.intApi, node);
}

module.exports = {
    create
};
