let FS = require("fs");
let Library = require("./library.js");

// () => undefined
function main() {
    let library = Library.create();
    let html = library.renderToString("x-products", 2);
    FS.writeFileSync(`${__dirname}/sample.html`, html);
    console.log("sample.html was generated");
}

main();
