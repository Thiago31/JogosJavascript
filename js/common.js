var defButton = {font: "100px Arial", selBackground: "orange",
    unselBackground: "orangeRed", border: "green", borderWidth: 5, padding: 20};

function button(text, x, y, config) {
    this.text = text;
    this.x = x;
    this.y = y;
    if (config === undefined) {
        config = defButton;
    }
    this.font = config.font || defButton.font;
    this.selBackground = config.selBackground || defButton.selBackground;
    this.unselBackground = config.unselBackground || defButton.unselBackground;
    this.padding = config.padding || defButton.padding;
    this.border = config.border || defButton.border;
    this.borderWidth = config.borderWidth || defButton.borderWidth;
    this.visible = false;

    this.draw = function (ctx) {
        if (this.visible === false) {
            return;
        }
        ctx.save();

        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        let textMetrics = ctx.measureText(this.text);
        this.yt = this.y - textMetrics.actualBoundingBoxAscent - this.padding;
        this.yb = this.y + textMetrics.actualBoundingBoxDescent + this.padding;
        this.xl = this.x - textMetrics.width / 2 - this.padding;
        this.xr = this.x + textMetrics.width / 2 + this.padding;

        ctx.fillStyle = this.border;
        ctx.fillRect(this.xl - this.borderWidth, this.yt - this.borderWidth,
                this.xr - this.xl + 2 * this.borderWidth,
                this.yb - this.yt + 2 * this.borderWidth);
        ctx.fillStyle = this.unselBackground;
        ctx.fillRect(this.xl, this.yt, this.xr - this.xl, this.yb - this.yt);

        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x, this.y);

        ctx.restore();

    };

    this.isClickArea = function (xa, ya) {
        return (xa > this.xl && xa < this.xr && ya > this.yt && ya < this.yb);
    };

    this.setPointer = function (canvas, xa, ya) {
        if (this.visible === false) {
            return;
        }
        if (this.isClickArea(xa, ya)) {
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "default";
        }
    };
}