// authors: peyao && sashap

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
const scanf = require('scanf');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 *  START
 */

function processInput() {
  let result = [];
  let T = scanf('%d');
  for (let testCase = 0; testCase < T; testCase++) {
    result[testCase] = {};
    result[testCase].numIngredients = scanf('%d');
    result[testCase].numPackages = scanf('%d');
    result[testCase].recipe = [];
    for (let ingredient = 0; ingredient < result[testCase].numIngredients; ingredient++) {
      result[testCase].recipe.push(scanf('%d'));
    }
    result[testCase].packages = [];
    for (let pkgRow = 0; pkgRow < result[testCase].numIngredients; pkgRow++) {
      result[testCase].packages[pkgRow] = [];
      for (let pkgCol = 0; pkgCol < result[testCase].numPackages; pkgCol++) {
        result[testCase].packages[pkgRow].push(scanf('%d'));
      }
    }
  }
  return result;
}

function solve(problem) {

  let result = 0;

  let packageRows = problem.numIngredients;
  let packageCols = problem.numPackages;

  // generate min/max
  for (let i = 0; i < packageRows; i++) {
    for (let j = 0; j < packageCols; j++) {
      let pkg = problem.packages[i][j];
      problem.packages[i][j] = {
        min: Math.ceil(pkg / (problem.recipe[i] * 1.1)),
        max: Math.floor(pkg / (problem.recipe[i] * 0.9)),
        original: pkg
      };
      // DEBUG(problem.packages[i][j]);
    }
  }

  // sort by increasing min
  for (let row = 0; row < packageRows; row++) {
    problem.packages[row].sort((a, b) => {
      return a.min - b.min;
    });
  }

  
  for (let col = 0; col < packageCols; col++) {
    
  }

  return result;
}

/**
 * MAIN
 */
(function main() {

  let problems = processInput();

  problems.forEach((problem, index) => {
    let result = solve(problem);
    console.log("Case #" + (index + 1) + ": " + result);
  });

})();

