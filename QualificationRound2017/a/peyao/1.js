/* jshint esversion: 6, node: true */
"use strict";

const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: fs.createReadStream('1.txt'),
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
  solve(inputParams.S, inputParams.K);

  // TODO: Output to fs instead of console.log
  // console.log(`Case #${lineNum}: ${line}`);
  lineNum++;
});

function processLine(line) {
  let splitted = line.split(' ');
  return {
    'S': splitted[0],
    'K': splitted[1]
  };
}

function solve(S, K) {
  //
}