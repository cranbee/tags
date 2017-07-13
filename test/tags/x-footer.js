// object => object
function render(ctx) {
    return ctx.template({
        activeMenuItem: ctx.props.activeMenuItem
    });
}

module.exports = {
    render
};
