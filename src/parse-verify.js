var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var stdio = require('stdio');

const stat = Promise.promisify(fs.stat);
const readdir = Promise.promisify(fs.readdir);
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

var ops = stdio.getopt({
    'parse': {key: 'p', description: 'Paths to directories containing files to parse', mandatory: true, args: '*'},
    'verify': {key: 'v', description: 'Path to file to verify against', mandatory: true, args: 1}
});

function verify(parseDir) {
  return readdir(parseDir).then((dirListing) => {
    return Promise.map(dirListing, (listing) => {
      const fullPath = path.join(parseDir, listing);
      return stat(fullPath).then((stats) => {
        if (!stats.isDirectory()) {
          verifyKeysInFile(fullPath);
        }
      });
    });
  });
}

function verifyKeysInFile(fullFileName) {
  return readFile(fullFileName, 'utf8').then(function (data) {
    // Todo: custom pattern
    var parseKeyRegex = /i18n\.translate\('(.*)'\)/g;
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

var parsePaths = ops.parse;
var translationFile = ops.verify;

if (Array.isArray(parsePaths)) {
  for (var parseDir of parsePaths) {
    verify(parseDir);
  }
} else {
  verify(parsePaths);
}
