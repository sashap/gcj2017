/* jshint esversion: 6, node: true */
"use strict";

const readline = require('readline');
const fs = require('fs');
const bigInt = require("big-integer");
const rl = readline.createInterface({
  input: fs.createReadStream('2.txt'),
  // output: fs.createWriteStream('2.out')
});
const outputStream = fs.createWriteStream('2.out');

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
  // console.log(inputParams);
  let result = solve(inputParams.N);

  // TODO: Output to fs instead of console.log
  console.log(`Case #${lineNum}: ${result}`);
  outputStream.write(`Case #${lineNum}: ${result}\n`);
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
  let lastTidy;
  console.log('>>> parseInt(N): ', parseInt(N));
  for (let i = bigInt(N); i.geq(0); i = i.minus(1)) {
    // Convert number into string array
    let elArray = (i + '').split('');
    console.log('>>> elArray: ', elArray);
    
    // Check if array is sorted
    if (isSorted(elArray)) {
      return i;
    } else if (i === 0) {
      return 0;
    }
  }
}

function isSorted(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      return false;
    }
  }
  return true;
}
