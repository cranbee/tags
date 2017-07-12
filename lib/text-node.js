let Tools = require("./tools.js");

// (object, object) => object
function create(library, rawNode) {
    return Tools.instance({
        text: rawNode.text
    }, {
        renderToString
    });
}

// (object, number, number) => string
function renderToString($, indent, level) {
    return Tools.format(Tools.esc($.text), indent, level);
}

// (object, object) => void
module.exports = {
    create
};
