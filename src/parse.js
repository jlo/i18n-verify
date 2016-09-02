"use strict";

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var stdio = require('stdio');

const stat = Promise.promisify(fs.stat);
const readdir = Promise.promisify(fs.readdir);
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

var ops = stdio.getopt({
    'parse': {key: 'p', description: 'Path to file(s) to parse', mandatory: true, args: '*'},
    'verify': {key: 'v', description: 'Path to file(s) to verify', args: '*'}
});

function getPathContents(dir, keyList) {
  return readdir(dir).then((dirListing) => {
    return Promise.map(dirListing, (listing) => {
      const fullPath = path.join(dir, listing);
      return stat(fullPath).then((stats) => {
        if (!stats.isDirectory()) {
          // parse from file
          getKeysFromFile(fullPath, keyList)
        }
      });
    });
  });
}

function getKeysFromFile(fullFileName, keyList) {
  console.log(fullFileName);
  readFile(fullFileName, 'utf8').then(function (data) {
    // Todo: custom pattern
    var translateParseRegexp = /i18n\.translate\('(.*)'\)/;
    data.replace(translateParseRegexp, function(data, keys) {
      console.log(keys);
      keyList.push(keys); // not yet seeing keys in Promise result
    });
  })
}

var filePaths = ops.parse;

let keyList = [];
if (Array.isArray(filePaths)) {
  for (file of filePaths) {
    getPathContents(file, keyList).then(function(res) { 
      console.log(res.val); 
    });
  }
} else {
  getPathContents(filePaths, keyList).then(function(res) { 
    console.log(keyList);
  });
}
