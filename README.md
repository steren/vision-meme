Google Cloud Vision and memes
=============================

Print results from the [Google Cloud Vision API](https://cloud.google.com/vision/) on images from [Reddit's /r/funny](https://www.reddit.com/r/funny/comments/49rpkb/dog_or_muffin/) of very similarly looking things.

Only the label with the highest score is kept and printed.

How to use
----------

Select an image from the dropdown list or upload your own. It expects images of 4 x 4 smaller images.
A loader indicates when results are pending from the Vision API.

How to run
----------

* replace `API_KEY` with the API key of your Google Cloud project in `vision-meme.js` (get it at https://console.cloud.google.com/apis/credentials)
* run a local server (for example by running `python -m SimpleHTTPServer`)


This is not a Google product (experimental or otherwise).
