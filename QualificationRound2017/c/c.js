#!/usr/bin/env node

// Google Code Jam 2017
// Qualification Round
// A.  Oversized Pancake Flipper
// Author: Sasha Parfenov


var readline = require('readline');
var bigInt = require("big-integer");

// Arguments processing
var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 -vv < input.txt > output.txt', 'solve the input with verbose output')
  .option('solver', {
    default: 'math',
    describe: 'Choose solver to use.  Options: math or loop',
  })
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
      n: line.split(' ')[0],
      k: line.split(' ')[1]
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
  INFO("Using ", argv.solver, "solver");
  INFO("Output")
  INFO("------")

  DEBUG("Test Cases:", JSON.stringify(testCases));

  var answer;
  for(var i = 0; i < testCases.length; i++){
    answer = (argv.solver === 'loop') ? solveLoop(testCases[i]) : solveMath(testCases[i]);
    console.log("Case #" + (i + 1) + ":", answer.join(" "));
  }

});


// Solve individual test case iteratively
function solveLoop(testCase) {
  // keeps track of remaining open stall groups and keeps them sorted largest to smallest
  var stallGroups = [parseInt(testCase.n)];
  // current open stall group size
  var current=0;
  // stalls available to the left after user enters current stall group
  var left=0;
  // stalls available to the right after user enters current stall group
  var right=0;
  for (var i = 0; i < parseInt(testCase.k); i++) {
    // User is entering largest available stall group
    current = stallGroups.shift();
    left = Math.floor(current / 2);
    right = (current % 2) > 0 ? left : left - 1;

    // Left and right are the new available stall groups and they
    // must be inserted in order which preserves descending sorting or remaining open stall groups
    if (left > 0) {
      var leftIndex = stallGroups.findIndex(function(e){ return e <= left; });
      leftIndex > -1 ? stallGroups.splice(leftIndex, 0, left) : stallGroups.push(left);
    }
    if (right > 0) {
      var rightIndex = stallGroups.findIndex(function(e){ return e <= right; });
      rightIndex > -1 ? stallGroups.splice(rightIndex, 0, right) : stallGroups.push(right);
    }
    DEBUG("User:", i, " current: ", current, " left: ", left, " right: ", right, " updated stalls: ", JSON.stringify(stallGroups));
  }
  return [left, right];
}


// Solve individual test case mathematically
function solveMath(testCase) {
  // Get remaining stall counts after last split
  var n = bigInt(testCase.n);
  var k = bigInt(testCase.k);
  var remainingStalls = (n.divide(k)).divmod(2);

  DEBUG("N: ", n.toString(), " K:", k.toString(), " N/K: ", (n.divide(k)).toString(), " MOD2:  (",  remainingStalls.quotient.toString(), ", ", remainingStalls.remainder.toString(), ")");

  var left = remainingStalls.quotient;
  var right = remainingStalls.remainder.greater(0) ? remainingStalls.quotient : remainingStalls.quotient.minus(1);

  return [left.toString(), right.toString()];
}



















