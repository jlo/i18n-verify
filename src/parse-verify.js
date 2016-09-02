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

function getPathContents(dir, keys) {
  return readdir(dir).then((dirListing) => {
    return Promise.map(dirListing, (listing) => {
      const fullPath = path.join(dir, listing);
      return stat(fullPath).then((stats) => {
        if (!stats.isDirectory()) {
          // parse from file
          getKeysFromFile(fullPath).then(function(keys) {
            // keys.push(res);
          });
        }
      });
    });
  });
}

function getKeysFromFile(fullFileName) {
  console.log(fullFileName);
  return readFile(fullFileName, 'utf8').then(function (data, keys) {
    // Todo: custom pattern
    var parseKeyRegex = /i18n\.translate\('(.*)'\)/g;
    var m;
    // var keys = [];

    do {
      m = parseKeyRegex.exec(data);
      if (m) {
        console.log(m[1]);
        // keys.push(m[1]);
      }
    } while (m);
    return keys;
    // data.replace(translateParseRegexp, function(data, keys) {
    //   console.log(keys);
    //   // keys.push(keys); // not yet seeing keys in Promise result
    // });
  })
}

var filePaths = ops.parse;

let keys = [];
if (Array.isArray(filePaths)) {
  for (file of filePaths) {
    getPathContents(file, keys).then(function(res) { 
      console.log(res.val); 
    });
  }
} else {
  getPathContents(filePaths, keys).then(function(res) { 
    console.log(keys);
  });
}
