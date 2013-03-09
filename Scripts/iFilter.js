function between(min, max) {
return Math.round(Math.random() * (min - max) + min);
}

function format(image) {
var pixelArray = [];
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.width = image.width;
canvas.height = image.height;
c.beginPath();
c.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, image.width, image.height);
c.closePath();
var pixels = c.getImageData(0, 0, canvas.width, canvas.height).data;
for ( i = 0; i < pixels.length - 4; i += 4 ) {
var red = pixels[i];
var green = pixels[i + 1];
var blue = pixels[i + 2];
var alpha = pixels[i + 3];
pixelArray.push({
red: red,
green: green,
blue: blue,
alpha: alpha
});
 }
 var output = {
 width: image.width,
 height: image.height,
 pixels: pixelArray
 };
 return output;
}

function parse(arg) {
var canvas = document.createElement("canvas");
canvas.width = arg.width;
canvas.height = arg.height;
var c = canvas.getContext("2d");
var output = c.createImageData( arg.width, arg.height );
var Output = output.data;
for ( i = 0, j = 0; j < Output.length - 4; i++, j += 4 ) {
var pix = arg.pixels[i];
Output[j] = pix.red;
Output[j + 1] = pix.green;
Output[j + 2] = pix.blue;
Output[j + 3] = pix.alpha;
 }
c.putImageData(output, 0, 0);
return output;
}

function toURL(arg) {
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.width = arg.width;
canvas.height = arg.height;
c.putImageData(arg, 0, 0);
var output = canvas.toDataURL();
return output;
}

var iFilter = {
greyscale: function(arg, options) {
if ( options.argType === "imageData" ) {
var pic = arg;
} else {
var pic = format(arg);
}
var p, random = between(1, 3);
//begin loop
for( x = 0; x < pic.pixels.length; x++ ) {
try{
p = pic.pixels[x];
var avg = (p.red + p.green + p.blue)/3;
p.red = avg;
p.green = avg;
p.blue = avg;
} catch(e) {

alert(x);

   }
  }
   if ( options.returnType === "dataURL" ) {
 var output = toURL(parse(pic));
 } else {
 var output = parse(pic);
 }
  return output;
 },
 invert: function(arg, options) {
if ( options.argType === "imageData" ) {
var pic = arg;
} else {
var pic = format(arg);
}
var p, random = between(1, 3);
//begin loop
for( x = 0; x < pic.pixels.length; x++ ) {
try{
p = pic.pixels[x];
p.red = 255 - p.red;
p.green = 255 - p.green;
p.blue = 255 - p.blue;
} catch(e) {

alert(x);

   }
  }
   if ( options.returnType === "dataURL" ) {
 var output = toURL(parse(pic));
 } else {
 var output = parse(pic);
 }
  return output;
 },
 sepia: function(arg, options) {
if ( options.argType === "imageData" ) {
var pic = arg;
} else {
var pic = format(arg);
}
var p, random = between(1, 3);
//begin loop
for( x = 0; x < pic.pixels.length; x++ ) {
try{
if ( options.type === "lazy" ) {
p = pic.pixels[x];
var avg = (p.red + p.green + p.blue)/3;
p.red = avg + 100;
p.green = avg + 50;
p.blue = avg;
}
else if ( options.type === "standard" ) {
p = pic.pixels[x];
p.red = (p.red * 0.393) + (p.green * 0.769) + (p.blue * 0.189);
p.green = (p.red * 0.349) + (p.green * 0.686) + (p.blue * 0.168);
p.blue = (p.red * 0.272) + (p.green * 0.534) + (p.blue * 0.189);
}
 } catch(e) {

alert(x);

   }
  }
   if ( options.returnType === "dataURL" ) {
 var output = toURL(parse(pic));
 } else {
 var output = parse(pic);
 }
  return output;
 },
 saturate: function(arg, options) {
 if ( options.argType === "imageData" ) {
var pic = arg;
} else {
var pic = format(arg);
}
 var p, hsl = [], img = [];
 for ( k = 0; k < pic.pixels.length; k++ ) {
 p = pic.pixels[k];
 hsl.push(rgbToHsl(p.red, p.green, p.blue));
 var me = hsl[k];
 me.saturation += options.amount;
 img.push(hslToRgb(me.hue, me.saturation, me.lightness));
 var ar = img[k];
 p.red = ar.red;
 p.green = ar.green;
 p.blue = ar.blue;
 }
 if ( options.returnType === "dataURL" ) {
 var output = toURL(parse(pic));
 } else {
 var output = parse(pic);
 }
 return output;
 },
 dots: function(arg, options) {
  if ( options.argType === "imageData" ) {
var pic = arg;
} else {
var pic = format(arg);
}
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.width = arg.width;
canvas.height = arg.height;
c.beginPath();
c.drawImage(arg, 0, 0, canvas.width, canvas.height, 0, 0, arg.width, arg.height);
c.closePath();
var pixels = c.getImageData(0, 0, canvas.width, canvas.height).data;
c.clearRect(0, 0, canvas.width, canvas.height);

for(var y = options.size; y < canvas.height; y += (options.size*2)) {
 // loop through each column
for(var x = options.size; x < canvas.width; x += (options.size*2)) {
var red = pixels[((canvas.width * y) + x) * 4];
var green = pixels[((canvas.width * y) + x) * 4 + 1];
var blue = pixels[((canvas.width * y) + x) * 4 + 2];
var alpha = pixels[((canvas.width * y) + x) * 4 + 3];
var color = rgbToHex(red, green, blue);
c.fillStyle = color;
c.beginPath();
c.arc(x, y, options.size, 0, Math.PI * options.size, false);
c.fill();
c.closePath();
 }
}

for(var y = 0; y < canvas.height; y += (options.size*2)) {
 // loop through each column
for(var x = 0; x < canvas.width; x += (options.size*2)) {
var red = pixels[((canvas.width * y) + x) * 4];
var green = pixels[((canvas.width * y) + x) * 4 + 1];
var blue = pixels[((canvas.width * y) + x) * 4 + 2];
var alpha = pixels[((canvas.width * y) + x) * 4 + 3];
var color = rgbToHex(red, green, blue);
c.fillStyle = color;
c.beginPath();
c.arc(x, y, options.size, 0, Math.PI * options.size, false);
c.fill();
c.closePath();
 }
}


if ( options.returnType === "dataURL" ) {
var output = canvas.toDataURL();
} else {
 var output = c.getImageData(0, 0, canvas.width, canvas.height);
 }
 return output;
}

};







/* iFilter.prototype.greyscale = function() {
var original = this.PixelData;
var New = this.blankData;
var c = this.c;
var canvas = this.canvas;
var pixels = original.data;
for (i = 0; i < pixels.length - 4; i += 4) {
var avg = (pixels[i] + pixels[i + 1] + pixels[i + 2])/3;
pixels[i] = avg;
pixels[i + 1] = avg;
pixels[i + 2] = avg;
 }
c.putImageData(original, 0, 0);
return canvas.toDataURL();
};

iFilter.prototype.invert = function() {
var original = this.PixelData;
var New = this.blankData;
var c = this.c;
var canvas = this.canvas;
var pixels = original.data;
for (i = 0; i < pixels.length - 4; i += 4) {
pixels[i] = 255 - pixels[i];
pixels[i + 1] = 255 - pixels[i + 1];
pixels[i + 2] = 255 - pixels[i + 2];
 }
c.putImageData(original, 0, 0);
return canvas.toDataURL();
};

iFilter.prototype.sepia = function(param) {
var original = this.PixelData;
var New = this.blankData;
var c = this.c;
var canvas = this.canvas;
var pixels = original.data;
if ( param === "lazy" || !param ) {
for (i = 0; i < pixels.length - 4; i += 4) {
var avg = (pixels[i] + pixels[i + 1] + pixels[i + 2])/3;
pixels[i] = avg + 100;
pixels[i + 1] = avg + 50;
pixels[i + 2] = avg;
 }
} else {
for (i = 0; i < pixels.length - 4; i += 4) {
pixels[i] = (pixels[i] * 0.393) + (pixels[i + 1] * 0.769) + (pixels[i + 2] * 0.189);
pixels[i + 1] = (pixels[i] * 0.349) + (pixels[i + 1] * 0.686) + (pixels[i + 2] * 0.168);
pixels[i + 2] = (pixels[i] * 0.272) + (pixels[i + 1] * 0.534) + (pixels[i + 2] * 0.189);
 }
}
c.putImageData(original, 0, 0);
return canvas.toDataURL();
};

 */
 
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {hue:h, saturation:s, lightness:l};
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {red:r * 255, green:g * 255, blue:b * 255};
}

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

