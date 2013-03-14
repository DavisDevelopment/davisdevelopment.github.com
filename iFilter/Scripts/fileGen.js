function fileGen(data) {
this.name = data.name;
this.text = data.text;
if(!data.mime) {
this.mime = "application/octet-stream";
} else {
this.mime = data.mime;
}
return this;
}

fileGen.prototype.download = function() {
//test for what method of download we'll be using
var DownloadAttributeSupport = 'download' in document.createElement('a'); //Chrome's download attribute
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder; //Any available BlobBuilder implementation
var URL = window.URL || window.webkitURL || window.mozURL || window.msURL; //Any available URL api
var BlobConstruct = true;
try {
new Blob([]);
} catch (e) {
BlobConstruct = false;
}
navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob; //saveblob method
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs; // upcoming saveAs method
//Now begin the download execution
if (BlobBuilder && navigator.saveBlob) { // if we've decided to use BlobBuilder/saveBlob method
  var builder = new BlobBuilder();
  builder.append(this.text);
  var blob = builder.getBlob(this.mime||"application/octet-stream");
  if (!this.name) this.name = "Download.bin";
  if (window.saveAs) {
   window.saveAs(blob, this.name);
  }
  else {
   navigator.saveBlob(blob, this.name);
  }

}
else if (BlobBuilder && URL) {
  var blob, url, builder = new BlobBuilder();
  builder.append(this.text);
  if (!this.mime) this.mime = "application/octet-stream";
  if (DownloadAttributeSupport) {
  blob = builder.getBlob(this.mime);
url = URL.createObjectURL(blob);
var link = document.createElement("a");
link.setAttribute("href",url);
link.setAttribute("download",this.name||"Download.bin");
var event = document.createEvent('MouseEvents');
 event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
 link.dispatchEvent(event);
}
else if (BlobConstruct && URL) {
  var url, blob = new Blob([this.text + "0/"], {type:this.mime});
  if (DownloadAttributeSupport) {
url = URL.createObjectURL(blob);
var link = document.createElement("a");
link.setAttribute("href",url);
link.setAttribute("download",this.name||"Download.bin");
var event = document.createEvent('MouseEvents');
 event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
 link.dispatchEvent(event);
}
else {
if (BrowserSupportedMimeTypes[this.mime.split(";")[0]] === true) {
  this.mime = "application/octet-stream";
 }
 
 blob = builder.getBlob(this.mime);
 url = URL.createObjectURL(blob);
 window.open(url, '_blank', '');
}
  setTimeout(function () {
   URL.revokeObjectURL(url);
  }, 250);
}
else if (!/\bMSIE\b/.test(navigator.userAgent)) {
  if (!this.mime) this.mime = "application/octet-stream";
  // Again I need to filter the mime type so a download is forced.
  if (BrowserSupportedMimeTypes[this.mime.split(";")[0]] === true) {
   this.mime = "application/octet-stream";
  }
  window.open("data:"+this.mime+","+encodeURIComponent(this.text), '_blank', '');

}
}
};