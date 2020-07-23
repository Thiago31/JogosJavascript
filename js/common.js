function inherit(parent, child) {
    child.prototype = Object.create(parent.prototype);
    Object.defineProperty(child.prototype, 'constructor', {
        value: child,
        enumerable: false,
        writable: true});
}

function GElement(canvas, rx, ry, rw, rh) {
    this.canvas = canvas;
    this.rx = rx;
    this.ry = ry;
    this.rw = rw;
    this.rh = rh;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.animations = [];
    this.clickable = false;
    this.composite = false;
    this.children = [];


    this.isClickAreaCentral = function (xa, ya) {
        return (xa > this.x - this.width / 2
                && xa < this.x + this.width / 2
                && ya > this.y - this.height / 2
                && ya < this.y + this.height / 2);
    };

    this.isClickAreaUpperLeft = function (xa, ya) {
        return (xa > this.x
                && xa < this.x + this.width
                && ya > this.y
                && ya < this.y + this.height);
    };

    this.isClickArea = this.isClickAreaCentral;

    this.click = function () {

    };

    this.mouseOn = function (isMouseOn) {

    };

    this.draw = function () {

    };

    this.update = function () {
        this.updateAnimations();
    };

    this.updateAnimations = function () {
        for (var i = 0; i < this.animations.length; i++) {
            this.animations[i].update();
        }
    };

    this.addAnimation = function (animation) {
        this.animations.push(animation);
    };

    this.getAnimation = function (name) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].name === name) {
                return this.animations[i];
            }
        }
        return null;
    };

    this.computeDimensions0 = function () {
        this.x = this.canvas.width * this.rx;
        this.y = this.canvas.height * this.ry;
        this.width = this.canvas.width * this.rw;
        this.height = this.canvas.height * this.rh;
    };

    this.computeDimensions = this.computeDimensions0;


}

function GPane(canvas, rx, ry, rw, rh) {
    GElement.call(this, canvas, rx, ry, rw, rh);

    this.background = "white";
    this.borderColor = "purple";
    this.borderWidth = 4;

    this.composite = true;

    this.draw = function () {
        ctx = this.canvas.getContext("2d");
        ctx.save();

        ctx.fillStyle = this.background;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2,
                this.width, this.height);
        ctx.lineWidth = this.borderWidth;
        ctx.lineJoin = "round";
        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2,
                this.width, this.height);

        ctx.restore();
    };

    this.addElement = function (element) {
        this.children.push(element);
        element.canvas = this;
        element.rx = (element.rx - 0.5) + this.rx / this.rw;
        element.ry = (element.ry - 0.5) + this.ry / this.rh;
        element.computeDimensions();
    };

    this.getContext = function (context) {
        return this.canvas.getContext(context);
    };

    this.zerify = function () {
        this.width = 0;
        this.height = 0;
        for(var i = 0; i < this.children.length; i++){
            this.children[i].width = 0;
            this.children[i].height = 0;
        }
    };

    this.computeDimensions();
}


function Page(canvas) {
    this.canvas = canvas;
    this.image = null;
    this.color = "white";
    this.borderWidth = 1;
    this.borderColor = "black";
    this.elements = [];
    this.active = false;

    this.addElement = function (element) {
        this.elements.push(element);
        if (element.composite === true) {
            for (var i = 0; i < element.children.length; i++) {
                this.addElement(element.children[i]);
            }
        }
    };

    this.getElement = function (index) {
        return this.elements[index];
    };

    this.removeAllElements = function () {
        this.elements = [];
    };

    this.update = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].update();
        }
    };

    this.draw = function () {
        ctx = canvas.getContext("2d");
        ctx.save();
        if (this.image === null) {
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        }
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].draw();
        }
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        var d = this.borderWidth / 2;
        ctx.strokeRect(d, d, this.canvas.width - this.borderWidth,
                this.canvas.height - this.borderWidth);

        ctx.restore();
    };

    this.setImage = function (imagesource) {
        if (imagesource === null) {
            this.image = null;
        } else {
            this.image = new Image();
            this.image.src = imagesource;
        }
    };

    this.getElementAt = function (x, y) {
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            if (el.isClickArea(x, y)) {
                if (el.composite === true) {
                    for (var j = 0; j < el.children.length; j++) {
                        var child = el.children[j];
                        if (child.isClickArea(x, y)) {
                            return child;
                        }
                    }
                }
                return this.elements[i];
            }
        }
        return null;
    };

    this.blockUserInput = function () {
        this.active = false;
        this.canvas.style.cursor = "default";
    };

    this.restoreUserInput = function () {
        this.active = true;
    };

    var self = this;
    this.mouseMoveListener = function (event) {
        if (self.active === false) {
            return;
        }
        var x = event.offsetX;
        var y = event.offsetY;
        var found = false;
        for (var i = 0; i < self.elements.length; i++) {
            var el = self.elements[i];
            if (el.clickable === false) {
                continue;
            }
            if (el.isClickArea(x, y)) {
                this.style.cursor = "pointer";
                found = true;
                el.mouseOn(true);
            } else {
                el.mouseOn(false);
            }
        }
        if (found === false) {
            this.style.cursor = "default";
        }
    };

    this.clickListener = function (event) {
        if (self.active === false) {
            return;
        }
        var x = event.offsetX;
        var y = event.offsetY;
        var el = self.getElementAt(x, y);
        if (el === null) {
            return;
        }
        el.click();
    };

}

function GImage(canvas, imgsource, rx, ry, rw, rh) {
    GElement.call(this, canvas, rx, ry, rw, rh);
    this.image = new Image();
    this.image.src = imgsource;

    this.draw = function () {
        ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2,
                this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    };

    this.computeDimensions();
}
inherit(GElement, GImage);

function GImageGroup(canvas, sources, rx, ry, rw, rh) {
    GElement.call(this, canvas, rx, ry, rw, rh);
    this.image = new Image();
    this.sources = sources;

    this.draw = function () {
        ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(this.image, this.x - this.width / 2,
                this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    };

    this.setImage = function (imgName) {
        this.image.src = this.sources[imgName];
    };

    this.computeDimensions();
}
inherit(GElement, GImageGroup);

function GLabel(canvas, text, rx, ry, rw, rh) {
    GElement.call(this, canvas, rx, ry, rw, rh);
    this.text = text;

    this.opaque = false;
    this.background = "white";
    this.textColor = "black";
    this.align = "left";

    this.draw = function () {
        ctx = canvas.getContext("2d");
        ctx.save();

        if (this.opaque === true) {
            ctx.fillStyle = this.background;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.fillStyle = this.textColor;
        ctx.font = this.font;
        ctx.textAlign = this.align;
        ctx.textBaseline = "top";
        var alx;
        if (this.align === "left") {
            alx = this.x;
        } else if (this.align === "center") {
            alx = this.x + this.width / 2;
        } else {
            alx = this.x;
        }
        ctx.fillText(this.text, alx, this.y);

        ctx.restore();
    };

    this.isClickArea = this.isClickAreaUpperLeft;

    this.computeDimensions = function () {
        this.computeDimensions0();
        this.font = this.height + "px Arial";
    };

    this.computeDimensions();
}
inherit(GElement, GLabel);

function GLink(canvas, text, rx, ry, rw, rh) {
    GLabel.call(this, canvas, text, rx, ry, rw, rh);
    this.selected = false;
    this.clickable = true;
    this.mouseOnSelColor = "cyan";
    this.mouseOnUnselColor = "red";
    this.mouseOffSelColor = "blue";
    this.mouseOffUnselColor = "black";

    this.click = function () {
        this.selected = true;
    };

    this.mouseOn = function (isMouseOn) {
        if (isMouseOn) {
            if (this.selected === true) {
                this.textColor = this.mouseOnSelColor;
            } else {
                this.textColor = this.mouseOnUnselColor;
            }
        } else {
            if (this.selected === true) {
                this.textColor = this.mouseOffSelColor;
            } else {
                this.textColor = this.mouseOffUnselColor;
            }
        }

    };
}
inherit(GLabel, GLink);

function GOptions(canvas, rx, ry, rw, rh, title, options) {
    GElement.call(this, canvas, rx, ry, rw, rh);
    this.title = title;
    this.options = options;
    this.composite = true;
    this.ft = 1.2;
    this.fs = 0.1;
    this.n = Object.keys(options).length;

    this.bgTitleColor = "navajowhite";
    this.bgItemColor = "beige";

    this.computeDimensions = function () {
        this.computeDimensions0();
        this.ri = rh / (this.n * (1 + this.fs) + this.ft);
        this.rt = this.ft * this.ri;
        this.rs = this.fs * this.ri;
        this.th = this.canvas.height * this.rt;
        this.font = this.th + "px Arial";
    };

    this.computeDimensions();

    var self = this;
    var yp = ry + this.rt + this.rs;
    for (var labeltext in options) {
        var item = new GLink(canvas, labeltext, rx + this.rs, yp, rw, this.ri);
        item.click = function () {
            for (var i = 0; i < self.children.length; i++) {
                self.children[i].selected = false;
                self.children[i].mouseOn(false);
            }
            this.selected = true;
            this.mouseOn(true);
        };
        this.children.push(item);
        yp += this.ri + this.rs;
    }
    this.children[0].selected = true;
    this.children[0].mouseOn(false);

    this.getSelected = function () {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].selected === true) {
                return this.options[this.children[i].text];
            }
        }
        return null;
    };

    this.draw = function () {
        ctx = this.canvas.getContext("2d");
        ctx.save();

        ctx.fillStyle = this.bgTitleColor;
        ctx.fillRect(this.x, this.y, this.width, this.th);

        ctx.fillStyle = this.bgItemColor;
        ctx.fillRect(this.x, this.y + this.th, this.width, this.height - this.th);

        ctx.fillStyle = "black";
        ctx.font = this.font;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(this.title, this.x + this.rs * this.width, this.y);
        ctx.restore();
    };

    this.isClickArea = this.isClickAreaUpperLeft;

}
inherit(GElement, GOptions);

function GButton(canvas, text, rx, ry, rht) {
    GElement.call(this, canvas, rx, ry, 0, 0);
    this.text = text;
    this.rht = rht;

    this.rpadding = 0.2;
    this.textColor = "black";
    this.borderColor = "black";
    this.borderWidth = 4;

    this.selColor = "darkcyan";
    this.unselColor = "cyan";
    this.background = this.unselColor;
    this.clickable = true;

    this.draw = function () {
        ctx = canvas.getContext("2d");
        ctx.save();

        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = this.background;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2,
                this.width, this.height);

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.lineJoin = "round";
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2,
                this.width, this.height);

        ctx.fillStyle = this.textColor;
        ctx.fillText(this.text, this.x, this.y + this.textAnchor);

        ctx.restore();
    };

    this.computeDimensions = function () {
        this.x = this.canvas.width * this.rx;
        this.y = this.canvas.height * this.ry;

        var fontSize = this.canvas.height * this.rht;
        this.font = fontSize + "px Arial";
        ctx = this.canvas.getContext("2d");
        ctx.font = this.font;
        ctx.textBaseline = "middle";
        var textMetrics = ctx.measureText(this.text);
        var padding = this.rpadding * (textMetrics.actualBoundingBoxAscent
                + textMetrics.actualBoundingBoxDescent);
        this.width = textMetrics.width + 2 * padding;

        this.height = textMetrics.actualBoundingBoxAscent
                + textMetrics.actualBoundingBoxDescent + 2 * padding;
        this.textAnchor = (textMetrics.actualBoundingBoxAscent
                - textMetrics.actualBoundingBoxDescent) / 2;
    };

    this.mouseOn = function (isMouseOn) {
        if (isMouseOn) {
            this.background = this.selColor;
        } else {
            this.background = this.unselColor;
        }
    };

    this.computeDimensions();
}
inherit(GElement, GButton);

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


        var textMetrics = ctx.measureText(this.text);
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

            var s = 10;
            var p = 12;
            var h = (this.atualHeight - 2 * s - 2 * p) / 7;
            ctx.font = h + "px Arial";
            var yi = this.yp + 3 * h / 2;
            ctx.fillText("Fim de jogo", this.x, yi);
            yi += s + h;
            ctx.fillText("Sua pontuação: " + this.points, this.x, yi);
            yi += this.atualHeight - 3 * h - 2 * s - p;
            ctx.fillStyle = this.background;
            var buttonWidth = ctx.measureText("Jogar novamente").width + 2 * p;
            var buttonHeight = h + 2 * p;
            ctx.fillRect(this.x - buttonWidth / 2, yi - buttonHeight / 2,
                    buttonWidth, buttonHeight);
            ctx.lineWidth = 2;
            ctx.fillStyle = "purple";
            ctx.strokeRect(this.x - buttonWidth / 2, yi - buttonHeight / 2,
                    buttonWidth, buttonHeight);
            ctx.fillStyle = "black";
            ctx.fillText("Jogar novamente", this.x, yi);

            var hIm = this.atualHeight - 4 * h - 4 * s - 2 * p;
            var yIm = this.yp + 3 * h + 2 * s;
            var wIm = this.image.width * hIm / this.image.height;
            var xIm = this.x - wIm / 2;
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

        if (this.state !== "displayed") {
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

function Game(canvas) {

    this.canvas = canvas;
    this.oriWidth = canvas.width;
    this.oriHeight = canvas.height;
    this.f = this.oriHeight / this.oriWidth;
    this.currentPage = null;
    this.interval = null;
    this.fps = 20;
    this.pages = [];

    var self = this;
    this.update = function () {
        this.currentPage.update();
    };

    this.draw = function () {
        this.currentPage.draw();
    };

    this.run = function () {
        self.update();
        self.draw();
    };

    this.start = function () {
        self.currentPage.restoreUserInput();
        self.interval = setInterval(self.run, self.fps);
    };

    this.stop = function () {
        if (this.interval === null) {
            return;
        }
        this.currentPage.blockUserInput();

        clearInterval(this.interval);
    };

    this.addPage = function (page) {
        this.pages.push(page);
    };

    this.setPage = function (index) {
        if (this.currentPage !== null) {
            this.currentPage.active = false;
            this.canvas.removeEventListener("mousemove", this.currentPage.mouseMoveListener);
            this.canvas.removeEventListener("click", this.currentPage.clickListener);
        }
        this.currentPage = this.pages[index];
        this.currentPage.active = true;
        this.canvas.addEventListener("mousemove", this.currentPage.mouseMoveListener);
        this.canvas.addEventListener("click", this.currentPage.clickListener);
    };

    this.setPageColor = function (color) {
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].color = color;
        }
    };

    this.createStartPage = function (buttonText, background, bgtype) {
        var page = new Page(this.canvas);
        if (bgtype === "color") {
            page.color = background;
        } else if (bgtype === "image") {
            page.setImage(background);
        }
        var button = new GButton(this.canvas, buttonText, 0.5, 0.5, 0.1);
        button.click = function () {
            if (self.pages.length === 1) {
                return;
            }
            ;
            self.setPage(1);
        };

        page.addElement(button);
        this.addPage(page);
        this.setPage(0);
    };

    this.linkButtonToPage = function (button, pageIndex) {
        button.click = function () {
            self.setPage(pageIndex);
        };
    };

    this.sleep = function (mili) {
        this.stop();
        setTimeout(self.start, mili);
    };

    this.resizeCanvas = function () {
        var wWidth = document.body.clientWidth;

        if (wWidth < self.oriWidth) {
            self.canvas.width = wWidth;
            self.canvas.height = self.f * wWidth;
        } else {
            self.canvas.width = self.oriWidth;
            self.canvas.height = self.oriHeight;
        }
        for(var i = 0; i < self.pages.length; i++){
            var page = self.pages[i];
            for(var j = 0; j < page.elements.length; j++){
                page.elements[j].computeDimensions();
            }
        }
        
    };

    window.addEventListener("resize", self.resizeCanvas);
}

function Player(labelscore) {
    this.score = 0;
    this.opponent = null;
    this.labelscore = labelscore;
    this.labeltext = labelscore.text;
    this.name = "Player";

    this.addScore = function (add) {
        this.score += add;
        this.labelscore.text = this.labeltext + this.score;
    };

    this.resetScore = function () {
        this.score = 0;
        this.labelscore.text = this.labeltext + this.score;
    };


    this.play = function () {

    };
}

function ComputerPlayer(page, labelscore) {
    Player.call(this, page, labelscore);
    this.name = "Computer";


}