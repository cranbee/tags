let FS = require("fs");
let Tags = require("../index.js");
let Template = require("@cranbee/template");

// () => object
function create() {
    let library = Tags.library();
    addTag(library, "x-card");
    addTag(library, "x-footer");
    addTag(library, "x-header");
    addTag(library, "x-menu");
    addTag(library, "x-products");
    return library;
}

// (object, string) => void
function addTag(library, type) {
    let tag = require(`./tags/${type}.js`);
    let html = FS.readFileSync(`${__dirname}/templates/${type}.html`, "utf-8");
    let template = Template.parse(html);
    library.addTag(type, tag, template);
}

module.exports = {
    create
};
