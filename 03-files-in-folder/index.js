const fs = require('fs/promises');
const path = require('path');

const folder = 'secret-folder';
const folderPath = path.join(__dirname, folder);

const getDataFiles = async () => {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const name = path.parse(filePath).name;
        const format = path.extname(filePath).slice(1);
        const size = (await fs.stat(filePath)).size;
        const infoFile = `${name} - ${format} - ${size / 1024}kb`;
        console.log(infoFile);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

getDataFiles();