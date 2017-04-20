#!/usr/bin/env node

// Google Code Jam 2017
// Qualification Round
// A.  Oversized Pancake Flipper
// Author: Sasha Parfenov

/* jshint esversion: 6, node: true */
"use strict";

const argv = require('yargs')
  .usage('Usage: $0 [options] < problem.in > problem.out')
  .example('$0 -vv < input.txt > output.txt', 'solve the input with verbose output')
  .count('v')
  .alias('v', 'verbose')
  .help('h')
  .alias('h', 'help')
  .argv;
var VERBOSE_LEVEL = argv.verbose;
function INFO()  { if (VERBOSE_LEVEL >= 1) console.log.apply(console, arguments); }
function DEBUG() { if (VERBOSE_LEVEL >= 2) console.log.apply(console, arguments); }

const rw = require('rw');
let inputLines = rw.readFileSync("/dev/stdin", "utf8").split('\n');

let T = parseInt(inputLines[0]);
let problems = [];
for(let l=1; l <= T; l++) {
  problems.push({
    s: inputLines[l].split(' ')[0].split(''),
    k: parseInt(inputLines[l].split(' ')[1])
  });
}

INFO("Input\n-----\n" + inputLines.join('\n'));
    
problems.forEach((problem, i) => {
  DEBUG("Solving case", (i + 1), ":", JSON.stringify(problem));
  let result = solve(problem);
  console.log("Case #" + (i + 1) + ": " + result);
});


function count(arr) {
  let initialCounts = {'+':0,'-':0};
  return arr.reduce((acc, currVal) => { 
      (currVal in acc) ? acc[currVal]++ : acc[currVal] = 1;
      return acc; 
    }, 
    initialCounts );
}

function flip(arr, idx, k) {
  if (idx < 0 || idx >= arr.length || idx + k > arr.length) return;
  for(let i = idx; i < idx + k; i++ ) {
    arr[i] = arr[i] === '+' ? '-' : '+';
  }
}

function allSame(arr) {
  return arr.every(x => x === arr[0]);
}

function solve(problem) {

  let s = problem.s.slice(0);
  let k = problem.k;
  let y = 0;
  let flipIndex = 0;
  let flipHistory = [];
  while(s.indexOf('-') > -1 ) {
    flipIndex = s.indexOf('-');
    while (flipIndex > 0 && flipIndex + k > s.length) {
      flipIndex--;
    }
    flipHistory.push(flipIndex);
    // Check if same index is being attempated for the 10th time, and if so, quit
    if (flipHistory.length > 10 &&  allSame(flipHistory.slice(-10))) break;
    DEBUG(s.join(''), "flip:", y, "index:", flipIndex, "count:", count(s));
    flip(s, flipIndex, k);
    y++;
  }
  DEBUG(s.join(''), "Total flips:", y, "count:", count(s));

  return s.indexOf('-') > -1 ? "IMPOSSIBLE" : y;
}
