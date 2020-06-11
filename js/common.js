var defButton = {font: "80px Arial", selBackground: "orangered",
    unselBackground: "orange", border: "green", borderWidth: 5, padding: 20};

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
    this.background = this.unselBackground;

    this.draw = function (ctx) {

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
        ctx.fillStyle = this.background;
        ctx.fillRect(this.xl, this.yt, this.xr - this.xl, this.yb - this.yt);

        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x, this.y);

        ctx.restore();

    };

    this.isClickArea = function (xa, ya) {
        return (xa > this.xl && xa < this.xr && ya > this.yt && ya < this.yb);
    };

    this.setPointer = function (canvas, xa, ya) {

        if (this.isClickArea(xa, ya)) {
            canvas.style.cursor = "pointer";
            this.background = this.selBackground;
        } else {
            canvas.style.cursor = "default";
            this.background = this.unselBackground;
        }
    };
}

function endGame(x, y, width, height, imagesrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.atualWidth = 0;
    this.atualHeight = 0;
    this.xp = x;
    this.yp = y;
    this.state = "hidden";

    this.dw = width / 60;
    this.dh = height / 60;
    this.points = 0;
    this.image = new Image();
    this.image.src = imagesrc;
    
    this.buttonRight = 0;
    this.buttonLeft = 0;
    this.buttonTop = 0;
    this.buttonBottom = 0;
    
    this.selBackground = "orangered";
    this.unselBackground = "orange";
    this.background = this.unselBackground;

    this.draw = function (ctx) {
        if (this.state === "hidden") {
            return;
        }
        ctx.save();

        ctx.fillStyle = "white";
        ctx.fillRect(this.xp, this.yp, this.atualWidth, this.atualHeight);

        ctx.strokeStyle = "purple";
        ctx.lineWidth = 8;
        ctx.lineJoin = "round";
        ctx.strokeRect(this.xp, this.yp, this.atualWidth, this.atualHeight);
        if (this.atualWidth >= 6 * this.dw) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";

            let s = 10;
            let p = 12;
            let h = (this.atualHeight - 2 * s - 2 * p) / 7;
            ctx.font = h + "px Arial";
            let yi = this.yp + 3 * h / 2;
            ctx.fillText("Fim de jogo", this.x, yi);
            yi += s + h;
            ctx.fillText("Sua pontuação: " + this.points, this.x, yi);
            yi += this.atualHeight - 3 * h - 2 * s - p;
            ctx.fillStyle = this.background;
            let buttonWidth = ctx.measureText("Jogar novamente").width + 2 * p;
            let buttonHeight = h + 2 * p;
            ctx.fillRect(this.x - buttonWidth / 2, yi - buttonHeight / 2,
                    buttonWidth, buttonHeight);
            ctx.lineWidth = 2;
            ctx.fillStyle = "purple";
            ctx.strokeRect(this.x - buttonWidth / 2, yi - buttonHeight / 2,
                    buttonWidth, buttonHeight);
            ctx.fillStyle = "black";
            ctx.fillText("Jogar novamente", this.x, yi);

            let hIm = this.atualHeight - 4 * h - 4 * s - 2 * p;
            let yIm = this.yp + 3 * h + 2 * s;
            let wIm = this.image.width * hIm / this.image.height;
            let xIm = this.x - wIm / 2;
            ctx.drawImage(this.image, xIm, yIm, wIm, hIm);
            
            this.buttonLeft = this.x - buttonWidth / 2;
            this.buttonRight = this.x + buttonWidth / 2;
            this.buttonTop = yi - buttonHeight / 2;
            this.buttonBottom = yi + buttonHeight / 2;
            
        }

        ctx.restore();
    };

    this.update = function () {
        if (this.state === "appearing") {
            this.xp -= this.dw;
            this.yp -= this.dh;
            this.atualWidth += 2 * this.dw;
            this.atualHeight += 2 * this.dh;
            if (this.atualWidth >= this.width || this.atualHeight >= this.height) {
                this.state = "displayed";
            }
        }
    };

    this.hide = function () {
        this.xp = this.x;
        this.yp = this.y;
        this.atualWidth = 0;
        this.atualHeight = 0;
        this.state = "hidden";
    };
    
    this.isClickArea = function (xa, ya) {

        if(this.state !== "displayed"){
            return false;
        }
        return (xa > this.buttonLeft && xa < this.buttonRight 
                && ya > this.buttonTop && ya < this.buttonBottom);
    };

    this.setPointer = function (canvas, xa, ya) {

        if (this.state !== "displayed") {
            return;
        }
        if (this.isClickArea(xa, ya)) {
            canvas.style.cursor = "pointer";
            this.background = this.selBackground;
        } else {
            canvas.style.cursor = "default";
            this.background = this.unselBackground;
        }

    };    
}