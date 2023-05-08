const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const readStream = fs.createReadStream(filePath, 'utf-8');

let text = '';

readStream.on('data', (chunk) => text += chunk);
readStream.on('end', () => console.log(text));
readStream.on('error', (err) => console.log(`Error: ${err.message}`));