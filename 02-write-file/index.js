const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const writeStream = fs.createWriteStream(filePath);
const readLine = readline.createInterface({ input, output });

console.log('Hello! Waiting for input...\n');

function changeContent(input) {
  if (input.toString() !== 'exit') {
    writeStream.write(`${input}\n`);
  } else {
    readLine.close();
  }
}

readLine.on('line' || 'SIGINT', changeContent);
readLine.on('close', () => console.log(`\nBye! The entered data is saved in a "${fileName}" file.`));
readLine.on('error', (err) => console.log(`Error: ${err.message}`));
