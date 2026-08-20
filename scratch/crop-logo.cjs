const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = 0xffffffff;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let k = n;
    for (let i = 0; i < 8; i++) {
      k = (k & 1) ? (0xedb88320 ^ (k >>> 1)) : (k >>> 1);
    }
    table[n] = k;
  }
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function unpaeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function cropPNG(inputPath, outputPath) {
  const fileBuf = fs.readFileSync(inputPath);
  
  if (fileBuf.readUInt32BE(0) !== 0x89504e47) {
    throw new Error('Not a PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < fileBuf.length) {
    const len = fileBuf.readUInt32BE(offset);
    const type = fileBuf.toString('ascii', offset + 4, offset + 8);
    const data = fileBuf.slice(offset + 8, offset + 8 + len);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    }
    offset += 12 + len;
  }

  console.log(`Original PNG: ${width}x${height}, BitDepth: ${bitDepth}, ColorType: ${colorType}`);

  if (colorType !== 6 || bitDepth !== 8) {
    throw new Error(`Unsupported PNG color type ${colorType} / bit depth ${bitDepth}`);
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

  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = rawPixels[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Bounding Box: X [${minX}..${maxX}], Y [${minY}..${maxY}]`);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  console.log(`Cropped PNG dimensions: ${cropW}x${cropH}`);

  const croppedStride = cropW * 4;
  const croppedInflated = Buffer.alloc(cropH * (1 + croppedStride));

  let outOffset = 0;
  for (let y = 0; y < cropH; y++) {
    croppedInflated[outOffset++] = 0; // Filter type 0
    const srcY = minY + y;
    const srcStart = (srcY * width + minX) * 4;
    rawPixels.copy(croppedInflated, outOffset, srcStart, srcStart + croppedStride);
    outOffset += croppedStride;
  }

  const deflated = zlib.deflateSync(croppedInflated);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(cropW, 0);
  ihdrData.writeUInt32BE(cropH, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const outBuf = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, outBuf);
  console.log(`Successfully written cropped logo to ${outputPath} (${outBuf.length} bytes)`);
}

const input = path.join(__dirname, '../src/assets/navbar/wouchify-logo.png');
const output = path.join(__dirname, '../src/assets/mobile/mobile-wouchify-logo.png');

cropPNG(input, output);
