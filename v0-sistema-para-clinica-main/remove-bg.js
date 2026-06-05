const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'logo.png');
const outputPath = path.join(__dirname, 'public', 'logo-transparent.png');

sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    console.log(`Processing image of size ${info.width}x${info.height}...`);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If the pixel is very close to white (background is off-white/white)
      if (r > 245 && g > 245 && b > 245) {
        data[i + 3] = 0; // Make transparent
      }
    }
    
    return sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
  })
  .then(() => {
    console.log('Background removed successfully and saved to public/logo-transparent.png!');
  })
  .catch(err => {
    console.error('Error processing image:', err);
  });
