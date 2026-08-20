const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function unpaeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

const inputPath = path.join(__dirname, '../src/assets/navbar/wouchify-logo.png');
const fileBuf = fs.readFileSync(inputPath);

let offset = 8;
let width = 0;
let height = 0;
const idatChunks = [];

while (offset < fileBuf.length) {
  const len = fileBuf.readUInt32BE(offset);
  const type = fileBuf.toString('ascii', offset + 4, offset + 8);
  const data = fileBuf.slice(offset + 8, offset + 8 + len);

  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
  } else if (type === 'IDAT') {
    idatChunks.push(data);
  }
  offset += 12 + len;
}

const compressedData = Buffer.concat(idatChunks);
const inflated = zlib.inflateSync(compressedData);
const stride = width * 4;
const rawPixels = Buffer.alloc(width * height * 4);

let inOffset = 0;
for (let y = 0; y < height; y++) {
  const filter = inflated[inOffset++];
  const lineStart = y * stride;
  const prevLineStart = (y - 1) * stride;

  for (let x = 0; x < stride; x++) {
    const raw = inflated[inOffset++];
    let a = x >= 4 ? rawPixels[lineStart + x - 4] : 0;
    let b = y > 0 ? rawPixels[prevLineStart + x] : 0;
    let c = (y > 0 && x >= 4) ? rawPixels[prevLineStart + x - 4] : 0;

    let val = 0;
    if (filter === 0) val = raw;
    else if (filter === 1) val = (raw + a) & 0xff;
    else if (filter === 2) val = (raw + b) & 0xff;
    else if (filter === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) val = (raw + unpaeth(a, b, c)) & 0xff;

    rawPixels[lineStart + x] = val;
  }
}

// Print non-zero alpha summary per X threshold
[0, 1, 5, 10, 20, 50, 100, 200].forEach(threshold => {
  let minX = width, maxX = -1, minY = height, maxY = -1;
  let count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = rawPixels[(y * width + x) * 4 + 3];
      if (alpha > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        count++;
      }
    }
  }
  console.log(`Threshold > ${threshold}: count=${count}, X [${minX}..${maxX}], Y [${minY}..${maxY}], size=${maxX - minX + 1}x${maxY - minY + 1}`);
});
