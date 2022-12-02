const jimp = require('jimp');
const fs = require('fs');
const PNG = require('pngjs').PNG;

const pixelmatch = require('pixelmatch');

const urlToBuffer = async (url) => {
    return new Promise(async (resolve, reject) => {
        await jimp.read(url, async (err, image) => {
            if (err) {
                console.log(`error reading image in jimp: ${err}`);
                reject(err);
            }
            image.resize(400, 400);
            return image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                if (err) {
                    console.log(`error converting image url to buffer: ${err}`);
                    reject(err);
                }
                resolve(buffer);
            });
        });
    });
};

const compareImage = async (
    twitterProfilePicURL,
    assetCDNURL
) => {
    try {
        console.log('> Started comparing two images');
        const img1Buffer = await urlToBuffer(twitterProfilePicURL);
        const img2Buffer = await urlToBuffer(assetCDNURL);
        const img1 = PNG.sync.read(img1Buffer);
        const img2 = PNG.sync.read(img2Buffer);
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const difference = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {
                threshold: 0.1,
            }
        );

        const compatibility = 100 - (difference * 100) / (width * height);
        console.log(`${difference} pixels differences`);
        console.log(`Compatibility: ${compatibility}%`);
        console.log('< Completed comparing two images');
        pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});
        fs.writeFileSync('diff.png', PNG.sync.write(diff));
        return compatibility;
    } catch (error) {
        console.log(`error comparing images: ${error}`);
        throw error;
    }
};

const usFlag = "https://flaglane.com/download/american-flag/american-flag-small.jpg";
const canadianFlagJpg = "https://flaglane.com/download/canadian-flag/canadian-flag-small.jpg";

compareImage('https://github.com/mapbox/pixelmatch/blob/HEAD/test/fixtures/4b.png?raw=true',
    'https://github.com/mapbox/pixelmatch/blob/HEAD/test/fixtures/6diff.png?raw=true'
)

// compareImage(usFlag,canadianFlagJpg)