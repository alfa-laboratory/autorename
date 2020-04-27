const fs = require('fs');
const path = require('path');
const colors = require('colors');
const kebabCase = require('lodash.kebabcase');

const defaultIgnoreDirs = ['node_modules', '.git', 'README.md'];


const getIgnoreDirnames = (filepath) => {
  const data = fs.readdirSync(filepath).find((value) => value === '.gitignore');

  if (!data) {
    return defaultIgnoreDirs;
  }

  const ignoredDirnamesData = fs.readFileSync(path.resolve(filepath, '.gitignore'))
    .toString()
    .split('\n')
    .filter(v => v);

  return [...defaultIgnoreDirs, ...ignoredDirnamesData];
  
} 

const getFormattedName = (value) => value.split(".").map((part) => kebabCase(part)).join('.');

const rename = (filepath, ignoreDirnames) => {
  const data = fs.readdirSync(filepath);
  data
    .filter((item) => !ignoreDirnames.includes(item))
    .forEach((value) => {
      const filepathForCheck = path.resolve(filepath, value);
      console.log(filepathForCheck);

      const filename = path.basename(filepathForCheck, path.extname(filepathForCheck));
      
      const resultFilename = getFormattedName(filename);
      const resultFilepath = path.resolve(filepath, `${resultFilename}${path.extname(filepathForCheck)}`);
      if (filepathForCheck !== resultFilepath) {
        console.log(colors.blue('Rename ', colors.bold(filepathForCheck),'\nto ', colors.bold(resultFilepath)));
      }
      try {
        fs.renameSync(filepathForCheck, resultFilepath);
        
      } catch (error) {
        console.log(error);
      }

      const stat = fs.statSync(resultFilepath);
      if (stat.isDirectory()) {
        rename(resultFilepath, ignoreDirnames);
      }
    }
  )
}

const process = (filepath) => {
  const ignoreDirnames = getIgnoreDirnames(filepath);

  rename(filepath, ignoreDirnames);
}

module.exports = process;