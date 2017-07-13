// object => object
function render(ctx) {
    let product = ctx.props.product;
    return ctx.template({
        title: product.title,
        price: product.price.toFixed(2),
        imageUrl: `/images/products/${product.id}.jpg`,
        addToCart: () => {
            // add to cart
        }
    });
}

module.exports = {
    render
};
