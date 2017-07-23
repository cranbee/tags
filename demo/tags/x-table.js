// object => object
function render(ctx) {
    let props = ctx.props;
    let rows = [];
    for (let r = 0; r < props.rows; r++) {
        let cells = [];
        for (let c = 0; c < props.cols; c++) {
            cells.push({
                value: 1000 + r * props.cols + c,
                mod: props.row === r && props.col === c ? "_selected" : "",
                click: () => ctx.props.onSelect(r, c)
            });
        }
        rows.push({ cells });
    }
    return ctx.template({ rows });
}

module.exports = {
    render
};
