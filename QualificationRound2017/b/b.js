#!/usr/bin/env node

// Google Code Jam 2017
// Qualification Round
// B.  Tidy Numbers
// Author: Sasha Parfenov

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
      n: line
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

  for(var i = 0; i < testCases.length; i++){
    var answerArr = solveArr(testCases[i].n.split(""));
    console.log("Case #" + (i + 1) + ":", answerArr.join(""));
  }

});


// Solve individual test case
function solveArr(digits) {


  var head = digits.slice(0);
  var tail = [head.pop()];
  while(head.length > 0) {
    if (head.slice(-1) <= tail[0]) {
      tail.splice(0,0,head.pop());
    } else {
      // we need to convert remainder to all 9's and try reducing head by 1
      tail.fill("9");
      // Try (-1) on last head element and see if head is tidy
      head[head.length - 1] = "" + ( parseInt(head.slice(-1)) - 1);
    }
  }

  // Remove leading 0's
  while(tail[0] === "0") {
    tail.shift();
  }

  return tail;
}




















