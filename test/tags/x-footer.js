// object => object
function render($) {
    return $.template("x-footer", {
        activeMenuItem: $.props.activeMenuItem
    });
}

module.exports = {
    render
};
