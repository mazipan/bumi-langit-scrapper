const fs = require('fs');

const writeFile = (pathFile, content) => {
  const stream = fs.createWriteStream(pathFile);
  stream.write(content);
  stream.end();
  console.log('Success write file: ', pathFile);
};

const readFile = async (pathFile) => {
  try {
    return await fs.promises.readFile(pathFile, 'utf8');
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  writeFile,
  readFile,
};
