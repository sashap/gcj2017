#!/usr/bin/env node

// Google Code Jam 2017
// Qualification Round
// C. Bathroom Stalls
// Author: Sasha Parfenov

/* jshint esversion: 6, node: true */
"use strict";

var readline = require('readline');
var bigInt = require("big-integer");
var Decimal = require('decimal.js');

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
    DEBUG("User:", (i+1), " current: ", current, " left: ", left, " right: ", right, " remaining stalls: ", JSON.stringify(stallGroups));
  }
  return [left, right];
}


// Solve individual test case mathematically
function solveMath(testCase) {
  // Get remaining stall counts after last split
  let n = bigInt(testCase.n);
  let k = bigInt(testCase.k);
  
  // Level where Kth person occupies a stall
  let level = bigInt((Decimal.floor(Decimal.log2(k.toString()))).toString());
  // Number of buckets on the current level
  let levelBuckets = bigInt(2).pow(level);
  let prevLevelsSum = levelBuckets.minus(1);
  // Number of people for current level (can be viewed as bucket index Kth person will use)  1 <= levelPeople <= levelBuckets
  let levelPeople = k.minus(prevLevelsSum);

  DEBUG("N:", n.toString(), "K:", k.toString(), "level:", level.toString(), "levelBuckets:", levelBuckets.toString(), "levelPeople:", levelPeople.toString(), "prevLevelsSum:", prevLevelsSum.toString());
  // total remaining stalls / total buckets on current level
  let levelBucket = (n.minus(prevLevelsSum)).divmod(levelBuckets);
  let levelBucketMin = levelBucket.quotient;
  let levelBucketMax = (levelBucket.remainder).gt(0) ? levelBucketMin.plus(1) : levelBucketMin;
  
  let levelBucketMaxMinBoundary = levelBucket.remainder;

    
  let lastPersonBucketSize = (levelPeople.minus(levelBucketMaxMinBoundary)).gt(0) ? levelBucketMin : levelBucketMax;

  DEBUG("levelBucketMin:", levelBucketMin.toString(), "levelBucketMax:", levelBucketMax.toString(), "levelBucketMaxMinBoundary:", levelBucketMaxMinBoundary.toString(), "lastPersonBucketSize:", lastPersonBucketSize.toString());

  let lastPersonSpace = (lastPersonBucketSize.minus(1)).divmod(2);
  let lastPersonSpaceMin = lastPersonSpace.quotient;
  let lastPersonSpaceMax = lastPersonSpace.remainder.gt(0) ? lastPersonSpaceMin.plus(1) : lastPersonSpaceMin;

  let answer = [ lastPersonSpaceMax,  lastPersonSpaceMin];

  
  return answer;
}
