
function Card(x, y, width, height, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = "closed";
    this.vectorMove = {x: x, y: y, v: 0};
    this.moving = false;
    this.xd = 0;
    this.yd = 0;
    this.id = id;
    this.living = true;

    this.draw = function (ctx) {
        if (this.living === false) {
            return;
        }
        ctx.save();

        let yt = this.y - this.height / 2;
        let yb = this.y + this.height / 2;
        let xl = this.x - this.width / 2;
        let xr = this.x + this.width / 2;

        ctx.fillStyle = "blue";
        ctx.fillRect(xl, yt, this.width, this.height);

        let fontSize = this.height / 2;
        ctx.font = fontSize + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(this.id.toString(), this.x, this.y);

        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.moveTo(xl, yt);
        ctx.lineTo(xr, yt);
        ctx.lineTo(this.x, this.y - this.yd);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xl, yb);
        ctx.lineTo(xr, yb);
        ctx.lineTo(this.x, this.y + this.yd);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xl, yt);
        ctx.lineTo(xl, yb);
        ctx.lineTo(this.x - this.xd, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xr, yt);
        ctx.lineTo(xr, yb);
        ctx.lineTo(this.x + this.xd, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    };

    this.update = function ( ) {
        let xfrag = this.width / 20;
        let yfrag = this.height / 20;
        if (this.state === "opening") {
            this.xd += xfrag;
            this.yd += yfrag;
            if (this.xd >= this.width / 2 ||
                    this.yd >= this.height / 2) {
                this.state = "opened";
            }
        } else if (this.state === "closing") {
            this.xd -= xfrag;
            this.yd -= yfrag;
            if (this.xd <= 0 || this.yd <= 0) {
                this.state = "closed";
            }
        }

        if (this.moving) {
            let vecX = this.vectorMove.x - this.x;
            let vecY = this.vectorMove.y - this.y;

            if ((vecX * vecX + vecY * vecY) > (this.vectorMove.v * this.vectorMove.v)) {
                let vecMod = Math.sqrt(vecX * vecX + vecY * vecY);
                let n = this.vectorMove.v / vecMod;
                vecX = n * vecX;
                vecY = n * vecY;
            } else {
                this.moving = false;
            }

            this.x = this.x + vecX;
            this.y = this.y + vecY;
        }
    };

    this.containsArea = function (xa, ya) {
        return (xa > this.x - this.width / 2 &&
                xa < this.x + this.width / 2 &&
                ya > this.y - this.height / 2 &&
                ya < this.y + this.height / 2);
    };

    this.move = function (xm, ym, vm) {
        this.vectorMove.x = xm;
        this.vectorMove.y = ym;
        if (vm === undefined || vm <= 0) {
            this.vectorMove.v = 10;
        } else {
            this.vectorMove.v = vm;
        }
        this.moving = true;
    };
}

function randomId(r, c) {
    this.size = r * c;
    this.returned = 0;
    this.list = [];
    for (let i = 0; i < this.size / 2; i++) {
        this.list[i] = 0;
    }
    this.next = function () {
        if (this.returned === this.size) {
            return -1;
        }
        let s = -1;
        do {
            s = Math.floor(Math.random() * this.size / 2);
            this.list[s] += 1;
        } while (this.list[s] > 2);
        this.returned += 1;
        return s;
    };

}

function scoreLabel(x, y, width, height, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.score = 0;

    this.draw = function (ctx) {
        ctx.save();

        ctx.font = (this.height * 3 / 5) + "pt Arial";
        ctx.textAlign = "start";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fillText(this.text + this.score, this.x, this.y + this.height / 2);
        ctx.restore();
    };
}