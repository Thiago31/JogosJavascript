function GAnimation(element) {
    this.active = false;

    if (element.composite === true) {
        this.originalPositionX = [];
        this.originalPositionY = [];
        for (var i = 0; i < element.children.length; i++) {
            var px = element.children[i].rx + 0.5 - element.rx / element.rw;
            var py = element.children[i].ry + 0.5 - element.ry / element.rh;
            this.originalPositionX.push(px);
            this.originalPositionY.push(py);
        }
    }
    element.addAnimation(this);
    
    this.update = function(){};
    this.start = function(){};
    this.stop = function(){
        this.active = false;
    };
}

function TeleportationAnimation2(element) {
    GAnimation.call(this, element);
    this.sizing = new SizeAnimation(element);
    this.newX = 0;
    this.newY = 0;
    this.fWidth = element.width;
    this.fHeight = element.height;
    this.changeRatio = 0;
    this.step = 0;

    this.update = function () {
        if (this.active === false) {
            return;
        }
        if (this.step === 0) {
            if (this.sizing.active === false) {
                this.step++;
            }
        } else if (this.step === 1) {
            element.x = this.newX;
            element.y = this.newY;
            this.step++;
        } else if (this.step === 2) {
            this.sizing.start(this.fWidth, this.fHeight, this.changeRatio);
            this.step++;
        } else if (this.step === 3) {
            if (this.sizing.active === false) {
                this.step = 0;
                this.active = false;
            }
        }
    };

    this.start = function (newX, newY, changeRatio) {
        this.newX = newX;
        this.newY = newY;
        this.changeRatio = changeRatio;
        this.active = true;
        this.sizing.start(0, 0, changeRatio);
    };
}

function TeleportationAnimation(element) {
    GAnimation.call(this, element);
    this.newX = 0;
    this.newY = 0;

    this.update = function () {
        if (this.active === false) {
            return;
        }
        element.x = this.newX;
        element.y = this.newY;
        this.active = false;
    };

    this.start = function (newX, newY) {
        this.newX = newX;
        this.newY = newY;
        this.active = true;
    };
}

function SizeAnimation(element) {
    GAnimation.call(this, element);
    this.fWidth = element.width;
    this.fHeight = element.height;
    this.dw = 0;
    this.dh = 0;

    this.update = function () {
        if (this.active === false) {
            return;
        }
        element.width += this.dw;
        element.height += this.dh;
        if ((this.dw > 0 && element.width > this.fWidth)
                || (this.dw < 0 && element.width < this.fWidth)) {
            element.width = this.fWidth;
        }
        if ((this.dh > 0 && element.height > this.fHeight)
                || (this.dh < 0 && element.height < this.fHeight)) {
            element.height = this.fHeight;
        }
        if (element.composite === true) {
            var frw = element.width / element.canvas.width;
            var frh = element.height / element.canvas.height;

            for (var i = 0; i < element.children.length; i++) {

                element.children[i].rx = this.originalPositionX[i] - 0.5 + element.rx / frw;
                element.children[i].ry = this.originalPositionY[i] - 0.5 + element.ry / frh;
                element.children[i].computeDimensions();
            }
        }

        if (element.width === this.fWidth
                && element.height === this.fHeight) {
            this.active = false;
        }
    };

    this.start = function (fWidth, fHeight, changeRatio) {
        this.fWidth = fWidth;
        this.fHeight = fHeight;
        this.dw = (fWidth - element.width) / changeRatio;
        this.dh = (fHeight - element.height) / changeRatio;
        this.active = true;
    };
}

function MoveAnimation(element) {
    GAnimation.call(this, element);
    this.xp = 0;
    this.yp = 0;
    this.v = 0;

    this.update = function () {
        if (this.active === false) {
            return;
        }
        var vecX = this.xp - element.x;
        var vecY = this.yp - element.y;

        if ((vecX * vecX + vecY * vecY) > (this.v * this.v)) {
            var vecMod = Math.sqrt(vecX * vecX + vecY * vecY);
            var n = this.v / vecMod;
            vecX = n * vecX;
            vecY = n * vecY;
        } else {
            this.active = false;
        }

        element.x = element.x + vecX;
        element.y = element.y + vecY;
    };

    this.start = function (xp, yp, v) {
        this.xp = xp;
        this.yp = yp;
        this.v = v;
        this.active = true;
    };
}

function PathMoveAnimation(element) {
    GAnimation.call(this, element);
    this.moving = new MoveAnimation(element);
    this.xpath = [];
    this.ypath = [];
    this.v = 0;
    this.n = 0;

    this.update = function () {
        if (this.active === false) {
            return;
        }
        if (this.moving.active === false) {
            this.n++;
            if (this.n === this.xpath.length) {
                this.active = false;
                this.n = 0;
            } else {
                this.moving.start(this.xpath[this.n],
                        this.ypath[this.n], this.v);
            }
        }
    };

    this.start = function (xpath, ypath, v) {
        this.xpath = xpath;
        this.ypath = ypath;
        this.v = v;
        this.moving.start(this.xpath[0], this.ypath[0], this.v);
        this.active = true;
    };
}