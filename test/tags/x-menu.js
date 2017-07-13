let ITEMS = [
    {
        title: "Products",
        url: "/products"
    },
    {
        title: "Blog",
        url: "/blog"
    },
    {
        title: "Contacts",
        url: "/contacts"
    }
];

// object => object
function render(ctx) {
    let type = ctx.props.type;
    let activeItem = ctx.props.activeItem;
    return ctx.template({
        mods: `_${type}`,
        items: ITEMS.map((item, index) => ({
            title: item.title,
            url: item.url,
            isActive: index === activeItem,
            mods: index === activeItem ? "_active" : ""
        }))
    });
}

module.exports = {
    render
};
