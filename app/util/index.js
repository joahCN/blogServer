/**
 * Created by mac on 17/12/30.
 */
var Jimp = require("jimp");
var htmlToText = require('html-to-text');

exports.extractImageName = function(imgUrl) {
    return imgUrl.substr(imgUrl.lastIndexOf("/")+1);
};

exports.getSmallImagePath = function(imgPath) {
    return imgPath.substring(0, imgPath.lastIndexOf(".")) + "-small" + imgPath.substring(imgPath.lastIndexOf("."));
};

exports.manipulateImage = function(imgPath, options = {}) {

    const destImgPath = imgPath.substring(0, imgPath.lastIndexOf(".")) + "-small" + imgPath.substring(imgPath.lastIndexOf("."));
    
    Jimp.read(imgPath).then(function (image) {
        image.resize(options.width || Jimp.AUTO, options.height || 250)            // resize
            .quality(80)                 // set JPEG quality
            .write(destImgPath); // save
    }).catch(function (err) {
        console.error(err);
    });
};


exports.extractTextFromHtml = function(html, subTextAmount = 120) {
    var text = htmlToText.fromString(html, {
        wordwrap: false,
        ignoreImage: true,
        ignoreHref: true
    });
    return text.substr(0, subTextAmount)
};
