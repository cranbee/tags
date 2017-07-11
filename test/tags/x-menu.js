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
function render($) {
    let type = $.props.type;
    let activeItem = $.props.activeItem;
    return $.template("x-menu", {
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
