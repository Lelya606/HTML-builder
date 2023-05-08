const fs = require('fs/promises');
const path = require('path');

const originalFolder = 'files';
const copyFolder = 'files-copy';
const copyFolderPath = path.join(__dirname, copyFolder);
const originalFolderPath = path.join(__dirname, originalFolder);

const copyDir = async () => {
  try {
    await fs.rm(copyFolderPath, { recursive: true, force: true });
    await fs.mkdir(copyFolderPath, { recursive: true });
    const files = await fs.readdir(originalFolderPath);

    for (let file of files) {
      const source = path.join(originalFolderPath, file);
      const destination = path.join(copyFolderPath, file);
      await fs.copyFile(source, destination);
    }
    console.log('Folder has been copied.');
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

copyDir();