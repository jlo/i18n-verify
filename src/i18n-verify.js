var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

const stat = Promise.promisify(fs.stat);
const readdir = Promise.promisify(fs.readdir);
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

function verify(parseDir, translationFile, parseKeyRegex) {
  return readdir(parseDir).then((dirListing) => {
    return Promise.map(dirListing, (listing) => {
      const fullPath = path.join(parseDir, listing);
      return stat(fullPath).then((stats) => {
        if (!stats.isDirectory()) {
          verifyKeysInFile(fullPath, translationFile, parseKeyRegex);
        }
      });
    });
  });
}

function verifyKeysInFile(fullFileName, translationFile, parseKeyRegex) {
  readFile(fullFileName, 'utf8').then(function (data) {
    var key;

    readFile(translationFile, 'utf8').then(function (translationData) {
      do {
        key = parseKeyRegex.exec(data);
        if (key) {
          if (translationData.indexOf(key[1]) == -1) {
            console.log('\'' + key[1] + '\'' + ' from ' + fullFileName + ' not present in ' + translationFile);
          }
        }
      } while (key);
    })
  })
}

module.exports = {
  main: function(parsePaths, translationFile, parseKeyRegex) {
    if (Array.isArray(parsePaths)) {
      for (var parseDir of parsePaths) {
        verify(parseDir, translationFile, parseKeyRegex);
      }
    } else {
      verify(parsePaths, translationFile, parseKeyRegex);
    }
  }
};
