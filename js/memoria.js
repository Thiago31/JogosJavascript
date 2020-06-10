var themes = {
    "Animais": [
        "baby_fish_T.png",
        "bear_song_dance_T.png",
        "blowfish_cartoon_T.png",
        "Bug_Watching_Fly_T.png",
        "bull_angry_T.png",
        "cartoon_leopard_T.png",
        "cartoon_monkey_T.png",
        "cartoon_whale_bold_T.png",
        "crocodile_sitting_cartoon_T.png",
        "dog_thoughtful_T.png",
        "frog_pirate_T.png",
        "lobster_cartoon_T.png",
        "lovesick_elephant_T.png",
        "lovesick_rhino_T.png",
        "owl_on_book_T.png",
        "penguin_sliding_on_ice_T.png",
        "pig_with_spots_cartoon_T.png",
        "pirate_parrot_T.png",
        "rabbit_toon_1_T.png",
        "rattlesnake_cartoon_T.png",
        "rat_with_cheese_T.png",
        "Rooster_cartoon_04_T.png",
        "Tanuki_racoon_dog_T.png",
        "walrus_cartoon_T.png"
    ],
    "Flores": [
        "basket_flowers.png",
        "beautiful_rose.png",
        "black_eyed_susans.png",
        "blue_and_yellow_flower.png",
        "California_poppy.png",
        "Cardinal_Flower__Lobelia_cardinalis.jpg",
        "Chrysantemum_grandiflorum.png",
        "chrysanthemum.png",
        "crocus.png",
        "dahlia.png",
        "Dahlia_illustration.jpg",
        "Hibiscus.png",
        "hibiscus_2.png",
        "Hollyhock.png",
        "hyacinth.png",
        "hydrangea.png",
        "Indian_Cress.png",
        "Laelia_gouldiana.png",
        "lily_yellow_stylized.png",
        "marigold.png",
        "morning_glory_T.png",
        "pansy_2.png",
        "pansy_daisies.png",
        "Papaver_Orientale.png",
        "pink_white_flowers.png",
        "Rudbeckia_hirta.png",
        "tulip_field.png",
        "vase_flowers.png",
        "wagon_filled_with_flowers_T.png",
        "water_lily.png",
        "yellow_rose_2.png"
    ],
    "Icones": [
        "black_man_red_hair_T.png",
        "black_man_wearing_glasses_T.png",
        "black_man_wearing_hat_T.png",
        "black_man_wearing_headset_T.png",
        "black_woman_long_blonde_hair_T.png",
        "blonde_man_T.png",
        "blonde_wearing_headset_T.png",
        "business_man_blue_tie_T.png",
        "business_man_pink_tie.png",
        "man_hard_hat_red_shirt_T.png",
        "man_redhead_wearing_headset_T.png",
        "man_red_hard_hat_T.png",
        "man_wearing_green_tie_T.png",
        "man_wearing_hat_T.png",
        "woman_cyan_blouse_T.png",
        "woman_long_hair_red_blouse_T.png",
        "woman_pink_blouse_T.png",
        "woman_wearing_headset_T.png"
    ],
    "Profissao": [
        "artist_T.png",
        "businessman_T.png",
        "carpenter_3_T.png",
        "chef_color_T.png",
        "cowboy_with_whip_T.png",
        "delivery_T.png",
        "farmer_T.png",
        "fire_toon_T.png",
        "knight_T.png",
        "Model_05_T.png",
        "movers_T.png",
        "nurse_T.png",
        "officer_stern_T.png",
        "police_woman_in_blue_T.png",
        "postman.png",
        "secretary_T.png",
        "smiling_small_clown_T.png",
        "troubadour_T.png"
    ],
    "Smiley": [
        "angel_wings_smiley_T.png",
        "bull-fighting-smilie.png",
        "chinese_cook_smiley.png",
        "confused-smilie.png",
        "farmer_smiley.png",
        "nerdy-teacher-smiley.png",
        "shy_clown.png",
        "smiley-big-laugh.png",
        "smiley_bandaged.png",
        "smiley_glossy.png",
        "smiley_rage.png",
        "smiley_sleeping.png",
        "smiley_wearing_party_hat.png",
        "smiley_wearing_shades.png",
        "smiley_w_mustache.png",
        "smilie-in-love.png",
        "smilie-thick-glasses.png",
        "smilie_points_to_you.png"
    ]

};


function Card(x, y, width, height, id, theme) {
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
    if (theme === undefined || theme === "Números") {
        this.image = "";
    } else {
        this.image = new Image();
        this.image.src = "img/themes/" + theme + "/" + themes[theme][id];
    }

    this.draw = function (ctx) {
        if (this.state === "removed") {
            return;
        }
        ctx.save();


        let yt = this.y - this.height / 2;
        let yb = this.y + this.height / 2;
        let xl = this.x - this.width / 2;
        let xr = this.x + this.width / 2;

        if (this.image === "") {
            ctx.fillStyle = "blue";
            ctx.fillRect(xl, yt, this.width, this.height);

            let fontSize = this.height / 2;
            ctx.font = fontSize + "px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";
            ctx.fillText(this.id.toString(), this.x, this.y);
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(xl, yt, this.width, this.height);
            let iWidth = this.width;
            let iHeight = this.height;
            let dw = 0;
            let dh = 0;
            if (this.image.width * this.image.height > 0) {
                let fw = this.width / this.image.width;
                let fh = this.height / this.image.height;
                let f = Math.min(fw, fh);
                iWidth = f * this.image.width;
                iHeight = f * this.image.height;
                dw = (this.width - iWidth) / 2;
                dh = (this.height - iHeight) / 2;
            }
            ctx.drawImage(this.image, xl + dw, yt + dh, iWidth, iHeight);
        }
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
        if (this.state === "removed") {
            return false;
        }
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

function randomId(r, c, g) {
    this.size = r * c;
    this.returned = 0;
    this.list = [];
    this.g = (g === undefined ? 2 : g);
    this.n = Math.floor(this.size / this.g);

    for (let i = 0; i < this.n; i++) {
        this.list[i] = 0;
    }
    this.next = function () {
        if (this.returned === this.size) {
            return -1;
        }
        let s = -1;
        do {
            s = Math.floor(Math.random() * this.n);
            this.list[s] += 1;
        } while (this.list[s] > this.g);
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
        ctx.fillStyle = "#aaeeaa";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fillText(this.text + this.score, this.x, this.y + this.height / 2);
        ctx.restore();
    };
}

function optionScreen(canvas, themeOptions, numberOptions) {
    this.width = canvas.width;
    this.height = canvas.height;
    let ctx = canvas.getContext("2d");
    this.border = 20;
    this.padding = 10;
    this.fontSize = 40;
    ctx.save();
    ctx.font = this.fontSize + "px Arial";
    let wordWidth = ctx.measureText("Iniciar").width;
    ctx.restore();
    this.buttonRight = this.width - this.border;
    this.buttonLeft = this.width - this.border - 2 * this.padding - wordWidth;
    this.buttonBottom = this.height - this.border;
    this.buttonTop = this.height - this.border - 2 * this.padding - this.fontSize;
    this.buttonUnsel = "orange";
    this.buttonSel = "orangered";
    this.buttonColor = this.buttonUnsel;
    this.themeOptions = themeOptions;
    this.selectedTheme = 0;
    this.numberOptions = numberOptions;
    this.numberPieces = [];
    this.selectedNumber = 0;
    for (let i = 0; i < this.numberOptions.length; i++) {
        let value = this.numberOptions[i];
        let q = value[0] * value[1];
        if (q % 2 === 1) {
            q -= 1;
        }
        this.numberPieces[i] = q;
    }

    this.showedTheme = -1;
    this.showedNumber = -1;

    this.draw = function (ctx) {
        ctx.save();

        ctx.fillStyle = this.buttonColor;
        ctx.fillRect(this.buttonRight, this.buttonTop,
                this.buttonLeft - this.buttonRight + 1,
                this.buttonBottom - this.buttonTop + 1);
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 4;
        ctx.strokeRect(this.buttonRight, this.buttonTop,
                this.buttonLeft - this.buttonRight + 1,
                this.buttonBottom - this.buttonTop + 1);
        ctx.font = this.fontSize + "px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Iniciar",
                (this.buttonLeft + this.buttonRight) / 2,
                (this.buttonTop + this.buttonBottom) / 2);

        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.width / 2, this.border);
        ctx.lineTo(this.width / 2, this.buttonTop - this.border);
        ctx.stroke();

        ctx.font = 1.4 * this.fontSize + "px Arial";
        ctx.fillStyle = "black";
        let xf = this.border;
        let yf = this.border + 0.7 * this.fontSize;
        ctx.textAlign = "left";
        ctx.fillText("Tema:", xf, yf);
        ctx.font = this.fontSize + "px Arial";
        yf += 0.3 * this.fontSize;
        for (let i = 0; i < this.themeOptions.length; i++) {
            yf += this.padding + this.fontSize;
            if (this.showedTheme === i) {
                if (this.selectedTheme === i) {
                    ctx.fillStyle = "purple";
                } else {
                    ctx.fillStyle = "red";
                }
            } else if (this.selectedTheme === i) {
                ctx.fillStyle = "blue";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillText(this.themeOptions[i], xf, yf);

        }

        xf = this.width / 2 + this.border;
        yf = this.border + 0.7 * this.fontSize;
        ctx.font = 1.4 * this.fontSize + "px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Peças:", xf, yf);
        ctx.font = this.fontSize + "px Arial";
        yf += 0.3 * this.fontSize;
        for (let i = 0; i < this.numberPieces.length; i++) {
            yf += this.padding + this.fontSize;
            if (this.showedNumber === i) {
                if (this.selectedNumber === i) {
                    ctx.fillStyle = "purple";
                } else {
                    ctx.fillStyle = "red";
                }
            } else if (this.selectedNumber === i) {
                ctx.fillStyle = "blue";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillText("" + this.numberPieces[i], xf, yf);
        }

        ctx.restore();
    };

    this.isClickArea = function (xa, ya) {

        return (xa > this.buttonLeft && xa < this.buttonRight
                && ya > this.buttonTop && ya < this.buttonBottom);
    };

    this.setPointer = function (canvas, xa, ya) {

        if (this.isClickArea(xa, ya)) {
            canvas.style.cursor = "pointer";
            this.buttonColor = this.buttonSel;
        } else if (this.indexTheme(xa, ya) > -1
                || this.indexNumber(xa, ya) > -1) {
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "default";
            this.buttonColor = this.buttonUnsel;
        }

    };

    this.indexTheme = function (xa, ya) {

        let yp = this.border + 1.4 * this.fontSize + this.padding;
        let yp2 = yp + this.themeOptions.length * (this.fontSize + this.padding);

        if (xa > this.border && xa < this.width / 2
                && ya > yp && ya < yp2) {
            return Math.floor((ya - yp) / (this.fontSize + this.padding));
        }
        return -1;
    };

    this.pointTheme = function (xa, ya) {
        this.showedTheme = this.indexTheme(xa, ya);
    };

    this.selectTheme = function (xa, ya) {
        let index = this.indexTheme(xa, ya);
        if (index > -1) {
            this.selectedTheme = index;
        }
    };

    this.getTheme = function () {
        return this.themeOptions[this.selectedTheme];
    };

    this.indexNumber = function (xa, ya) {

        let yp = this.border + 1.4 * this.fontSize + this.padding;
        let yp2 = yp + this.numberOptions.length * (this.fontSize + this.padding);

        if (xa > this.border + this.width / 2 && xa < this.width
                && ya > yp && ya < yp2) {
            return Math.floor((ya - yp) / (this.fontSize + this.padding));
        }
        return -1;
    };

    this.pointNumber = function (xa, ya) {
        this.showedNumber = this.indexNumber(xa, ya);
    };

    this.selectNumber = function (xa, ya) {
        let index = this.indexNumber(xa, ya);
        if (index > -1) {
            this.selectedNumber = index;
        }
    };

    this.getNumber = function () {
        return this.numberOptions[this.selectedNumber];
    };
}