// object => object
function render(ctx) {
    return ctx.template({
        products: [
            {
                id: 1,
                title: "Product A",
                price: 9.9
            },
            {
                id: 2,
                title: "Product B",
                price: 14.4
            },
            {
                id: 3,
                title: "Product C",
                price: 19
            }
        ]
    });
}

module.exports = {
    render
};
