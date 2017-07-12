let CustomNode = require("./custom-node.js");
let StandardNode = require("./standard-node.js");
let Template = require("@cranbee/template");
let TextNode = require("./text-node.js");
let Tools = require("./tools.js");

// any => object
function create(ctx) {
    let $ = {
        ctx,
        templates: {},
        tags: {}
    };
    let extApi = Tools.instance($, {
        addTemplate,
        addTag,
        renderToString
    });
    let intApi = Tools.instance($, {
        createNode,
        hasTag,
        renderTag
    });
    $.intApi = intApi;
    return extApi;
}

// (object, string, array) => void
function addTemplate($, name, template) {
    $.templates[name] = template;
}

// (object, string, object) => void
function addTag($, name, tag) {
    $.tags[name] = tag;
}

// (object, string, number) => string
function renderToString($, tagName, indent = 0) {
    let rawNode = { type: tagName, props: {}, children: [] };
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
function hasTag($, name) {
    return !!$.tags[name];
}

// (object, string, object, array, object) => object
function renderTag($, name, props, children, state) {
    let result = $.tags[name].render({
        ctx: $.ctx,
        props: prepareProps(props),
        children,
        state,
        template: (name, data) => Template.execute($.templates[name], data)
    });
    return Array.isArray(result) ? result[0] : result;
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
