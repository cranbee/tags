let FS = require("fs");
let Library = require("./library.js");
let Tags = require("../index.js");
let Test = require("tape");

let GRE_WS = /\s+/g;

Test("RenderToString", t => {
    let library = Library.create();
    let htmlPretty = Tags.renderToString(library, "x-products", 2);
    compareWithSample(t, htmlPretty);
    let htmlMin = Tags.renderToString(library, "x-products");
    t.equal(htmlPretty.length > htmlMin.length, true);
    let noWs1 = htmlPretty.replace(GRE_WS, "");
    let noWs2 = htmlMin.replace(GRE_WS, "");
    t.equal(noWs1.length, noWs2.length);
    t.end();
});

// (object, string) => void
function compareWithSample(t, html) {
    let sample = FS.readFileSync(`${__dirname}/sample.html`, "utf-8");
    let lines1 = html.split("\n");
    let lines2 = sample.split("\n");
    let n = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < n; i++) {
        let line1 = lines1[i] || "";
        let line2 = lines2[i] || "";
        if (line1 !== line2) {
            t.equal(line1, line2, `sample.html at line ${i + 1}`);
            return;
        }
    }
    t.pass("sample.html");
}
