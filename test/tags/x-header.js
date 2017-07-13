// object => object
function render(ctx) {
    return ctx.template({
        activeMenuItem: ctx.props.activeMenuItem,
        user: { name: "Root" },
        showUserMenu: () => {
            // show user menu
        }
    });
}

module.exports = {
    render
};
