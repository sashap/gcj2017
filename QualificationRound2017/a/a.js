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
const BitArray = require('node-bitarray')


let T = parseInt(inputLines[0]);
let problems = inputLines.slice(1).map((line) => {

  return {
    s: new BitArray(line.split(' ')[0].replace(/\+/g, '1').replace(/-/g, '0')),
    k: parseInt(line.split(' ')[1])
  }
});

INFO("Input\n-----\n" + inputLines.join('\n'));
    
problems.forEach((problem, i) => {
  DEBUG("Current BitArray: ", problem.s.toString(), "count(+):", problem.s.count());
  DEBUG("Solving case", (i + 1), ":", JSON.stringify(problem));
  let result = solve(problem);
  console.log("Case #" + (i + 1) + ": " + result);
});


function solve(problem) {



  return "IMPOSSIBLE";
}