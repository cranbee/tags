// object => object
function render($) {
    return $.template("x-header", {
        activeMenuItem: $.props.activeMenuItem,
        user: {
            name: "Root"
        },
        showUserMenu: () => {
            // show user menu
        }
    });
}

module.exports = {
    render
};
