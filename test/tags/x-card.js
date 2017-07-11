// object => object
function render($) {
    let product = $.props.product;
    return $.template("x-card", {
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
