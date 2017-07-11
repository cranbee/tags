let Template = require("@cranbee/template");
let Tools = require("./tools.js");

// any => object
function create(ctx) {
    return Tools.instance({
        ctx,
        templates: {},
        tags: {}
    }, {
        addTemplate,
        addTag,
        hasTag,
        renderTag
    });
}

// (object, string, array) => void
function addTemplate($, name, template) {
    $.templates[name] = template;
}

// (object, string, object) => void
function addTag($, name, spec) {
    $.tags[name] = spec;
}

// (object, string) => boolean
function hasTag($, name) {
    return !!$.tags[name];
}

// (object, string, object, array) => object
function renderTag($, name, props, children) {
    let spec = $.tags[name];
    return spec.render({
        ctx: $.ctx,
        props: translateProps(props),
        children,
        template: (name, data) => renderTemplate($, name, data)
    });
}

// (object, string, object) => object
function renderTemplate($, name, data) {
    let result = Template.execute($.templates[name], data);
    if (result.length !== 1) {
        throw Error(`The "${name}" template should be rendered to a single node`);
    }
    return result[0];
}

// object => object
function translateProps(props) {
    let newProps = {};
    Object.keys(props).forEach(key => {
        newProps[Tools.toLowerCamelCase(key)] = props[key];
    });
    return newProps;
}

module.exports = {
    create
};
