// object => void
function init(ctx) {
    ctx.state.rows = 10;
    ctx.state.cols = 10;
    ctx.state.row = 0;
    ctx.state.col = 0;
    ctx.state.inProgress = false;
}

// object => object
function render(ctx) {
    return ctx.template({
        rows: ctx.state.rows,
        cols: ctx.state.cols,
        row: ctx.state.row,
        col: ctx.state.col,
        addRowsDisabled: false,
        delRowsDisabled: ctx.state.rows === 10,
        addColsDisabled: false,
        delColsDisabled: ctx.state.cols === 10,
        startDisabled: ctx.state.inProgress,
        stopDisabled: !ctx.state.inProgress,
        info: getInfo(ctx),
        addRows() {
            ctx.state.rows += 10;
            ctx.refresh();
        },
        delRows() {
            ctx.state.rows -= 10;
            ctx.refresh();
        },
        addCols() {
            ctx.state.cols += 10;
            ctx.refresh();
        },
        delCols() {
            ctx.state.cols -= 10;
            ctx.refresh();
        },
        start() {
            let f = () => {
                if (!ctx.state.inProgress) {
                    ctx.refresh();
                    return;
                }
                frames += 1;
                ctx.state.fps = Math.trunc(frames / (Date.now() - startTime) * 1000);
                ctx.state.col += 1;
                if (ctx.state.col >= ctx.state.cols) {
                    ctx.state.col = 0;
                    ctx.state.row += 1;
                }
                if (ctx.state.row >= ctx.state.rows) {
                    ctx.state.row = 0;
                }
                ctx.refresh();
                window.requestAnimationFrame(f);
            };
            let startTime = Date.now();
            let frames = 0;
            ctx.state.inProgress = true;
            ctx.state.fps = 0;
            f();
        },
        stop() {
            ctx.state.inProgress = false;
        },
        select(row, col) {
            ctx.state.row = row;
            ctx.state.col = col;
            ctx.refresh();
        }
    });
}

// object => string
function getInfo(ctx) {
    return ctx.state.inProgress
        ? `${ctx.state.fps} fps`
        : `${ctx.state.rows} x ${ctx.state.cols}`;
}

module.exports = {
    init,
    render
};
