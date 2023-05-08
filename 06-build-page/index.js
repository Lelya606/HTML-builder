const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const projectFolderName = 'project-dist';
const projectFolderPath = path.join(__dirname, projectFolderName);

const assetsFolderName = 'assets';
const assetsFolderPath = path.join(__dirname, assetsFolderName);
const assetsFolderCopyPath = path.join(projectFolderPath, assetsFolderName);

const stylesFolderName = 'styles';
const newStylesFileName = 'style.css';
const stylesFolderPath = path.join(__dirname, stylesFolderName);
const newStylesFilePath = path.join(projectFolderPath, newStylesFileName);

const components = 'components';
const htmlFileName = 'template.html';
const htmlCopyFileName = 'index.html';

const componentsPath = path.join(__dirname, components);
const htmlFilePath = path.join(__dirname, htmlFileName);
const htmlCopyFilePath = path.join(projectFolderPath, htmlCopyFileName);

const charset = 'utf-8';

const buildStyles = async(stylesPath, newStylesPath) => {
  const writeStream = fs.createWriteStream(newStylesPath);
  const files = await fsPromises.readdir(stylesPath, { withFileTypes: true });

  for (const file of files) {
    const sourceFilePath = path.join(stylesPath, file.name);
    const extension = path.extname(sourceFilePath);

    if (file.isFile() && extension === '.css') {
      let styleFileContent = await fsPromises.readFile(sourceFilePath, charset);
      styleFileContent = `${styleFileContent.trim()}\n\n`;
      writeStream.write(styleFileContent);
    }
  }
}

const copyAssets = async (filePath, copyFilePath) => {
  await fsPromises.rm(copyFilePath, { recursive: true, force: true });
  await fsPromises.mkdir(copyFilePath, { recursive: true });
  const files = await fsPromises.readdir(filePath, { withFileTypes: true });

  for (let file of files) {
    const source = path.join(filePath, file.name);
    const destination = path.join(copyFilePath, file.name);

    if (file.isFile()) {
      await fsPromises.copyFile(source, destination);
    } else {
      await copyAssets(source, destination);
    }
  }
}

const createHtml = async (htmlPath, htmlCopyPath, componentsPath) => {
  await fsPromises.copyFile(htmlPath, htmlCopyPath);
  let htmlFileContent = await fsPromises.readFile(htmlCopyPath, charset);
  const writeStream = fs.createWriteStream(htmlCopyPath);
  const files = await fsPromises.readdir(componentsPath, { withFileTypes: true });

  for (const file of files) {
    const sourceFilePath = path.join(componentsPath, file.name);
    const extension = path.extname(sourceFilePath);

    if (file.isFile() && extension === '.html') {
      const sourceFileName = path.parse(sourceFilePath).name;
      const htmlContent = await fsPromises.readFile(sourceFilePath, charset);
      const replace = `{{${sourceFileName}}}`;
      htmlFileContent = htmlFileContent.replace(replace, htmlContent);
    }
  }

  writeStream.write(htmlFileContent);
}

const createBuild = async () => {
  try {
    await fsPromises.rm(projectFolderPath, {recursive: true, force: true});
    await fsPromises.mkdir(projectFolderPath, {recursive: true});
    await buildStyles(stylesFolderPath, newStylesFilePath);
    await copyAssets(assetsFolderPath, assetsFolderCopyPath);
    await createHtml(htmlFilePath, htmlCopyFilePath, componentsPath);
    console.log('Project is build successfully');
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

createBuild();