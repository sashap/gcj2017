/* jshint esversion: 6, node: true */
"use strict";

const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: fs.createReadStream('2.txt'),
  // output: process.stdout
});

let lineNum = 0;
let totalTestCases;
rl.on('line', (line) => {
  // get first line: totalTestCases
  if (lineNum === 0) {
    totalTestCases = line;
    lineNum++;
    return;
  }

  let inputParams = processLine(line);
  console.log(inputParams);
  let result = solve(inputParams.N);

  // TODO: Output to fs instead of console.log
  console.log(`Case #${lineNum}: ${result}\n`);
  lineNum++;
});

function processLine(line) {
  let splitted = line.split(' ');
  return {
    'N': splitted[0]
  };
}

function solve(N) {
  return solveNaive(N);
}

function solveNaive(N) {
  // Convert string N into array
  let nArray = N.split('');
  
  // Check if array is sorted
  return isSorted(nArray);
}

function isSorted(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      return false;
    }
  }
  return true;
}