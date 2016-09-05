var parseVerify = require('./parse-verify-core');
var stdio = require('stdio');

var ops = stdio.getopt({
  'parse': {key: 'c', description: 'Paths to directories containing constructs to parse', mandatory: true, args: '*'},
  'verify': {key: 'v', description: 'Path to file to verify against', mandatory: true, args: 1},
  'pattern': {key: 'p', description: 'Regex pattern to parse against', args: 1, default: 'translate\\(\'(.*)\'\\)'}
});

var parsePaths = ops.parse;
var translationFile = ops.verify;
var parseKeyRegex = new RegExp(ops.pattern, 'g');

parseVerify.main(parsePaths, translationFile, parseKeyRegex);
