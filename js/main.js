var renderOptions = {
    autoResize: true,
    resolution: 2,
    clearBeforeRender: true,
    roundPixels: true
};

var el = $('body');
var width = parseInt(el.width),
    height = parseInt(el.height);


var renderer = new PIXI.WebGLRenderer(width, height, renderOptions);
renderer.backgroundColor = 0xfbfbfb;
el.appendChild(renderer.view);
var stage = new PIXI.Container();

var resolution = 3;

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return ((1 << 24) + Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255);
}

var colors = [];

function draw(x, y, radius, levels, i) {
    i = i || 0;
    var rect = new PIXI.Graphics;

    rect.lineStyle(1, colors[i], .15);
    //circle.drawCircle(0, 0, radius)
    drawRect(rect, -radius, -radius, radius * 2, radius * 2)
    rect.position.set(x, y)
    stage.addChild(rect);
    if (i < levels) {
        var n = radius / 2;
        //draw(x - radius, y - radius, n, levels, i + 1);
        draw(x + radius, y - radius, n, levels, i + 1);
        draw(x + radius, y + radius, n, levels, i + 1);
        draw(x - radius, y + radius, n, levels, i + 1);
    }
}

function drawRect(rect, x, y, width, height) {
    var len = width / 5;
    var div = width / len
    for (var i = 0; i < len; i++) {
        rect.drawCircle(i * div + x, y, div / 2)
        rect.drawCircle(i * div + x, height + y, div / 2)
    }

    var len = height / 5;
    var div = height / len
    for (var i = 0; i < len; i++) {
        rect.drawCircle(x, i * div + y, div / 2)
        rect.drawCircle(width + x, i * div + y, div / 2)
    }
    rect.position.set(x, y);
    return rect;
}
var max = 6;
for (var i = 0; i < max; i++) {
    colors[i] = hslToRgb(i / max, .7, .4);
}
console.log(colors)
draw(width / 2 * resolution, height / 2 * resolution, 200 * resolution, max);
stage.scale.set(1 / resolution)
renderer.render(stage)
