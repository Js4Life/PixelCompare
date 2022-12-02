const Jimp = require('jimp');

async function compareImages(image1Url, image2Url) {

    const image1 = await Jimp.read(image1Url);
    const image2 = await Jimp.read(image2Url);
    // Perceived distance
    const distance = Jimp.distance(image1, image2);
    // Pixel difference
    const diff = Jimp.diff(image1, image2);
    
    console.log(`compareImages: distance: ${distance.toFixed(3)}, diff.percent: ${diff.percent.toFixed(3)}`);
    if (distance < 0.15 || diff.percent < 0.15) {
        console.log("compareImages: Images match!");
        return true;
    } else {
        console.log("compareImages: Images do NOT match!");
        return false;
    }
}

const usFlag = "https://flaglane.com/download/american-flag/american-flag-small.jpg";
const canadianFlagJpg = "https://flaglane.com/download/canadian-flag/canadian-flag-small.jpg";
const canadianFlagPng = "https://flaglane.com/download/canadian-flag/canadian-flag-small.png";

// These should not match.
compareImages(usFlag, canadianFlagJpg)

// These should match.
compareImages(canadianFlagJpg, canadianFlagPng);