$(document).ready(function() {

$("#toolbar").buttonset();

//interface
$("#wrapper").tabs();
$("button").button();
$("#toolbar a").button();
$("#download-iFilter").button();
$("#editor").tooltip();
$("#dialog-photos").dialog({
autoOpen: false,
show: "blind",
hide: "explode",
width: 800,
height: 600
});
$("#dialog-nocanvas").dialog({
autoOpen: false,
hide: "fade",
modal: true
});
$("#saturation-slider").slider({
range: "min",
value: 0,
min: -5,
max: 5,
slide: function(event, ui) {
$("#saturation-input").val(ui.value);
}
});
$("#pixel-slider").slider({
range: "min",
value: 0,
min: 0,
max: 20,
slide: function(event, ui) {
$("#pixel-input").val(ui.value);
$("#pixel-label").text("Dot Size: " + ui.value);
}
});
$("#saturation-input").spinner({
step: 0.01
});
$("#editor-preview").resizable();
$("#preview-container").draggable({
containment: "#display"
});

$("#dialog-sepia").dialog({
autoOpen: false,
show: "blind",
hide: "blind",
modal: true
});



//Editor GUI

//Greyscale Handler
$("#editor-greyscale").click(function() { 
var picture = document.getElementById("editor-preview");
var image = new Image();
image.src = picture.src;
image.onload = function() {
var newImage = iFilter.greyscale(image, {returnType: "dataURL"});
picture.src = newImage;
$("#editor-save").attr("href", newImage);
}

});
//Invert Handler
$("#editor-invert").click(function() { 
var picture = document.getElementById("editor-preview");
var image = new Image();
image.src = picture.src;
image.onload = function() {
var newImage = iFilter.invert(image, {returnType: "dataURL"});
picture.src = newImage;
$("#editor-save").attr("href", newImage);
}

});

// Saturation Handler
$("#dialog-saturate").dialog({
autoOpen: false,
show: "blind",
hide: "blind",
modal: true,
buttons: [{ text: "Okay", click: function() { 
$(this).dialog("close");
var picture = document.getElementById("editor-preview");
var image = new Image();
image.src = picture.src;
image.onload = function() {
var newImage = iFilter.saturate(image, {returnType: "dataURL", amount: parseFloat($("#saturation-input").val()) });
picture.src = newImage;
$("#editor-save").attr("href", newImage);
}
}}]
});
$("#editor-saturate").click(function() {
$("#dialog-saturate").dialog( "open" );
});

// Pixelation handler
$("#dialog-pixelate").dialog({
autoOpen: false,
show: "blind",
hide: "blind",
modal: true,
buttons: [{ text: "Okay", click: function() { 
$(this).dialog("close");
var picture = document.getElementById("editor-preview");
var image = new Image();
image.src = picture.src;
image.onload = function() {
var newImage = iFilter.dots(image, {returnType: "dataURL", size: parseFloat($("#pixel-input").val()) });
picture.src = newImage;
$("#editor-save").attr("href", newImage);
}
}}]
});
$("#editor-pixelate").click(function() {
$("#dialog-pixelate").dialog( "open" );
});

// Sepia Handler
$("#sepia-standard").click(function() {  //Standard Sepia
$("#dialog-sepia").dialog( "close" );
var picture = document.getElementById("editor-preview");
var image = new Image();
image.src = picture.src;
image.onload = function() {
var newImage = iFilter.sepia(image, {returnType: "dataURL", type: "standard"});
picture.src = newImage;
$("#editor-save").attr("href", newImage);
}
});
$("#sepia-lazy").click(function() { //Lazy Sepia
$("#dialog-sepia").dialog( "close" );
var picture = document.getElementById("editor-preview");
var image = new Image();
image.src = picture.src;
image.onload = function() {
var newImage = iFilter.sepia(image, {returnType: "dataURL", type: "lazy"});
picture.src = newImage;
$("#editor-save").attr("href", newImage);
}
});
$("#editor-sepia").click(function() {
$("#dialog-sepia").dialog( "open" );
});

$(".radio-options").buttonset();

//Open File for Editing
var selectFile = $("#editor-open").browseElement();
selectFile.change(function(e) {
var file = this.files[0];
var reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = function(d) {
var url = d.target.result;

$("#editor-preview")[0].src = url; // Set the preview's src to the dataURL
$("#editor-preview").attr("title", ""); //Set it's title attribute to an empty string to delete the tooltip

 }
});

    // Feature Testing //
//--------------------------//
	 
// Download Attribute
var downloadAttrSupported = ("download" in document.createElement("a"));
if ( !downloadAttrSupported ) {
$("#editor-save").attr("title", "The Save button currently only works in Google Chrome, but will work in all browsers when the docMan.js library is released. Sorry :/ ");
}
// Canvas Api
var canvasSupp = Modernizr.canvas;
if ( !canvasSupp ) {
$("#dialog-nocanvas").dialog( "open" );
}

});