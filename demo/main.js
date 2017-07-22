let Tags = require("../index.js");
let Template = require("@cranbee/template");

// () => undefined
function main() {
    let ctx = {};
    let library = Tags.library(ctx);
    addTag(library, "x-root");
    addTag(library, "x-table");
    let domNode = document.getElementById("root");
    ctx.refresh = library.mount("x-root", domNode);
}

// (object, string) => undefined
function addTag(library, name) {
    let tag = require(`./tags/${name}.js`);
    let html = require(`./tags/${name}.html`);
    let template = Template.parse(html);
    library.addTag(name, tag, template);
}

main();
