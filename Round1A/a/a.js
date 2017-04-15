#!/usr/bin/env node

// Google Code Jam 2017
// Round 1A
// A. Alphabet Cake
// Authors: Peter Yao / Sasha Parfenov


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

var testCaseLines = [];
var testCaseR = 0;
var testCaseC = 0;
var readingTestCaseLines = false;

// Process input from stdin
rl.on('line', function(line){
  inputLines.push(line);
  if (testCaseCount < 0) {
    testCaseCount = parseInt(line);
  } else if ( !readingTestCaseLines ) {
    testCaseR = parseInt(line.split(' ')[0]);
    testCaseC = parseInt(line.split(' ')[1]);
    readingTestCaseLines = true;
    testCaseLines = [];
  } else {
    testCaseLines.push(line.split(''));
    if (testCaseLines.length === testCaseR) {
      testCases.push({
        r: testCaseR,
        c: testCaseC,
        lines: testCaseLines
      });
      readingTestCaseLines = false;
    }
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
  DEBUG("Test Cases:", JSON.stringify(testCases));

  INFO("Output")
  INFO("-----")
  var answer;
  for(var i = 0; i < testCases.length; i++){
    answer = solve(testCases[i]);
    console.log("Case #" + (i + 1) + ":");
    printAnswer(answer);
  }

});

function printAnswer(answer) {
  for(var i=0; i < answer.length; i++) {
    console.log(answer[i].join(""));
  }
}

// Solve individual test case
function solve(testCase) {
  var solution = testCase.lines.slice(0);
  var seenLetters = {};
  
  function fillLetter(l) {
    DEBUG("filling l: ", l);
    var row = seenLetters[l][0];
    var col = seenLetters[l][1];
    // fill left
    var leftFillCount = 0;
    for(col = col - 1; col >= 0; col--) {
      if(solution[row][col] === '?') {
        solution[row][col] = l;
        leftFillCount++;
      }
    }
    
    // fill top
    var canFill;
    var topFillCount = 0;
    for (row = seenLetters[l][0] - 1; row >= 0; row--){
      canFill = true;
      for (col = seenLetters[l][1]; col >= seenLetters[l][1] - leftFillCount; col--) {
        if (solution[row][col] !== '?') canFill = false;
      }
      if (canFill) {
        for (col = seenLetters[l][1]; col >= seenLetters[l][1] - leftFillCount; col--) {
          solution[row][col] = l;
        }
        topFillCount++;
      } else {
        break;
      }
    }
    
    // fill right
    var rightFillCount = 0;
    for (col = seenLetters[l][1] + 1; col < solution[0].length; col++) {
      canFill = true;
      for (row = seenLetters[l][0]; row >= seenLetters[l][0] - topFillCount; row--) {
        if (solution[row][col] !== '?') canFill = false;
      }
      if (canFill) {
        for (row = seenLetters[l][0]; row >= seenLetters[l][0] - topFillCount; row--) {
          solution[row][col] = l;
        }
        rightFillCount++;
      } else {
        break;
      }
    }
    
    // fill bottom
    var leftBound = seenLetters[l][1] - leftFillCount;
    var rightBound = seenLetters[l][1] + rightFillCount;
    for (row = seenLetters[l][0] + 1; row < solution.length; row++) {
      canFill = true;
      for (col = leftBound; col <= rightBound; col++) {
        if (solution[row][col] !== '?') canFill = false;
      }
      if (canFill) {
        for (col = leftBound; col <= rightBound; col++) {
          solution[row][col] = l;
        }
      } else {
        break;
      }
    }
      
    if (VERBOSE_LEVEL >= 2) printAnswer(solution);
  }
  
  for (var row=0; row < solution.length; row++) {
    for (var col=0; col < solution[row].length; col++) {
      if ( solution[row][col] !== '?' ) {
        seenLetters[solution[row][col]] = [row,col];
      }
    }
  }

  DEBUG("seen letters: ", JSON.stringify(seenLetters));
  
  for (var letter in seenLetters) {
    fillLetter(letter);
  }
  
  return solution;
}
