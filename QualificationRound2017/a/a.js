#!/usr/bin/env node

// Google Code Jam 2017
// Qualification Round
// A.  Oversized Pancake Flipper
// Author: Sasha Parfenov


var glob = require('glob-fs')({ gitignore: true });
var fs = require("fs");
var readline = require('readline');

// Arguments processing
var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 --verbose < input.txt > output.txt', 'solve the input with verbose output')
  .count('v')
  .alias('v', 'verbose')
  .help('h')
  .alias('h', 'help')
  .argv;
 
var VERBOSE_LEVEL = argv.verbose;
 
function INFO()  { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments); }
function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments); }

DEBUG("Arguments (argv)", argv);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


var inputLines = [];
var testCases = [];
var testCaseCount = -1;

// Process input from stdin
rl.on('line', function(line){
  inputLines.push(line);
  if (testCaseCount < 0) {
    testCaseCount = parseInt(line);
  } else {
    testCases.push({
      s: line.split(' ')[0],
      k: parseInt(line.split(' ')[1])
    });
  }
}).on('close', function(){

  if (testCaseCount !== testCases.length) {
    console.log("ERROR: Bad number of test cases.  Expected: ", testCaseCount, " Actual: ", testCases.length);
    console.log("Test Cases: ", JSON.stringify(testCases, null, '  '));
    process.exit(1);
  }

  INFO("Input")
  INFO("-----")
  INFO(inputLines.join('\n'));
  INFO("");
  INFO("Output")
  INFO("------")

  for(var i = 0; i <= testCases.length; i++){
    var answer = solve(testCases[i]);
    console.log("Case #" + i + ":", answer);
  }

});

// Solve individual test case
function solve(testCase) {

  return "IMPOSSIBLE";
}