const fs = require('fs');
const { readdir, readFile } = require('fs/promises');
const path = require('path');

const sourceFolderName = 'styles';
const outputFolderName = 'project-dist';
const outputFileName = 'bundle.css';
const sourceFolderPath = path.join(__dirname, sourceFolderName);
const outputFilePath = path.join(__dirname, outputFolderName, outputFileName);

const buildStyle = async () => {
  try {
    const writeStream = fs.createWriteStream(outputFilePath);
    const files = await readdir(sourceFolderPath, { withFileTypes: true });

    for (const file of files) {
      const sourceFilePath = path.join(sourceFolderPath, file.name);
      const sourceFileExtension = path.extname(sourceFilePath);

      if (file.isFile() && sourceFileExtension === '.css') {
        let styleFileContent = await readFile(sourceFilePath, 'utf-8');
        styleFileContent = `${styleFileContent.trim()}\n\n`;
        writeStream.write(styleFileContent);
      }
    }

    console.log('Bundling is finished!');
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

buildStyle();