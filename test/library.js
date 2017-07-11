let FS = require("fs");
let Tags = require("../index.js");
let Template = require("@cranbee/template");

// () => object
function create() {
    let library = Tags.library();
    addTagWithTemplate(library, "x-card");
    addTagWithTemplate(library, "x-footer");
    addTagWithTemplate(library, "x-header");
    addTagWithTemplate(library, "x-menu");
    addTagWithTemplate(library, "x-products");
    return library;
}

// (object, string) => void
function addTagWithTemplate(library, name) {
    let html = FS.readFileSync(`${__dirname}/templates/${name}.html`, "utf-8");
    let template = Template.parse(html);
    library.addTemplate(name, template);
    library.addTag(name, require(`./tags/${name}.js`));
}

module.exports = {
    create
};
