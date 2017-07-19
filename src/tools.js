let GRE_DASH_LETTER = /-([a-z])/g;

// (object, object) => object
function instance(state, methods) {
    let api = {};
    Object.keys(methods).forEach(key => {
        api[key] = methods[key].bind(null, state);
    });
    return api;
}

// any => boolean
function isVoid(value) {
    return value === undefined || value === null;
}

// string => string
function esc(str) {
    str = replace(str, "&", "&amp;");
    str = replace(str, "<", "&lt;");
    str = replace(str, ">", "&gt;");
    str = replace(str, '"', "&quot;");
    str = replace(str, "'", "&#39;");
    str = replace(str, "`", "&#96;");
    return str;
}

// string => boolean
function isVoidElement(name) {
    // Spec:
    // https://www.w3.org/TR/html5/syntax.html#void-elements
    return [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "keygen",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr"
    ].includes(name);
}

// string => string
function toLowerCamelCase(str) {
    return str.replace(GRE_DASH_LETTER, (m, p1) => p1.toUpperCase());
}

// (string, number, number) => string
function format(str, indent, level) {
    return indent === 0 ? str : " ".repeat(indent * level) + str + "\n";
}

// (string, string, string) => string
function replace(str, search, replacement) {
    return str.includes(search) ? str : str.split(search).join(replacement);
}

module.exports = {
    instance,
    isVoid,
    esc,
    isVoidElement,
    toLowerCamelCase,
    format
};
