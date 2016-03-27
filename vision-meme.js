/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

API_KEY = "AIzaSyCcIGI2z3AKQ5jONoS0tSVSQWDKHzm5GyY";

// http makes an HTTP request and calls callback with parsed JSON.
var http = function(method, url, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) { return; }
    if (xhr.status >= 400) {
      message('API request failed');
      console.log('XHR failed', xhr.responseText);
      return;
    }
    cb(JSON.parse(xhr.responseText));
  };
  xhr.send(body);
};


// detect makes a Cloud Vision API request with the API key.
var detect = function(b64dataArray, cb) {
  var url = 'https://vision.googleapis.com/v1/images:annotate?key='+API_KEY;
  var data = {requests:[]};

  for(var b = 0; b < b64dataArray.length; b++) {
    data.requests.push({
      image: {content: b64dataArray[b]},
      features: [{'type':'LABEL_DETECTION', 'maxResults':1}]
    })
  }

  http('POST', url, JSON.stringify(data), cb);
};

/** split the entered image in an array of base64 images */
var imgSplit = function (url, splitX, splitY, cb) {
  var image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function() {

    drawImage(this);

    smallImgHeight = this.naturalHeight / splitX;
    smallImgWidth = this.naturalWidth / splitY

    var canvas = document.createElement('canvas');
    canvas.height = smallImgHeight;
    canvas.width = smallImgWidth;

    var b64dataArray = [];
    for(var y = 0; y < splitY; y++) {
      for(var x = 0; x < splitX; x++) {
        canvas.getContext('2d').drawImage(this, smallImgWidth * x, smallImgHeight * y, smallImgWidth, smallImgHeight, 0, 0, smallImgWidth, smallImgHeight);
        var b64data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
        b64dataArray.push(b64data);
      }
    }
    cb(b64dataArray);

  };
  image.src = url;
}

var message = function(message) {
  console.log(message);
};

var processImage = function(src) {
  message('processing...');
  document.getElementById('loader').classList.add('is-active');


  imgSplit(src, 4, 4, function(b64dataArray) {

    detect(b64dataArray, function(data) {
      message('result received');
      console.log(data.responses);
      
      document.getElementById('loader').classList.remove('is-active');
      drawResults(4, 4, data);
    });
  });
}

var drawImage = function(img) {
  var canvas = document.getElementById("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);
}

var drawResults = function(splitX, splitY, data) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  var size = 22;
  ctx.font = " " + size + "px sans-serif";
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;


  for(var r = 0; r < data.responses.length; r++) {
    //for(var l = 0; l < data.responses[r].labelAnnotations.length; l++) {
    var label = data.responses[r].labelAnnotations[0].description;
    var x = (r % splitX) * canvas.width / splitX;
    var y = (Math.floor(r / splitX) + 1) * canvas.height / splitY;
    ctx.strokeText(label, x, y);
    ctx.fillText(label, x, y);

  }
};

var selectChange = function(fileName) {
  processImage(document.location.href + "img/"+ fileName);
}

function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      processImage(e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// load first value by default
selectChange(document.getElementById("select").value);

