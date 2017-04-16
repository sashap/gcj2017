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

  let pkgRows = problem.numIngredients;
  let pkgCols = problem.numPackages;
  let pkgServings = [];

  // generate min/max
  DEBUG("Generating min/max pkgServings:");
  for (let i = 0; i < pkgRows; i++) {
    pkgServings[i] = [];
    for (let j = 0; j < pkgCols; j++) {
      let minMax = [
        Math.ceil(problem.packages[i][j] / (problem.recipe[i] * 1.1)),
        Math.floor(problem.packages[i][j] / (problem.recipe[i] * 0.9))
      ];
      if (minMax[0] <= minMax[1]) {
        pkgServings[i].push(minMax);
      } else {
        DEBUG("  excluding min > max", minMax);
      }
    }
    if (pkgServings[i].length < 1) {
      DEBUG("EXITING solve - NO possible servings for ingredient ", (i), problem.recipe[i] + "g");
      return 0;
    } 

    // sort pkgServings by increasing min
    DEBUG("Sorting pkgServings by min, max:");
    pkgServings[i].sort((a, b) => {
      return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
    });
    DEBUG(JSON.stringify(pkgServings[i]));

  }

  

  // search for available kits based on first row
  // when first row is empty or any other row is empty, we're done
  let kits = [];
  while(pkgServings[0].length > 0) {
    let possibleKit = [pkgServings[0].shift()];
    for(let row=1; row < pkgRows; row++) {
      // Get rid of incompatible packages
      while(pkgServings[row].length > 0 && pkgServings[row][0][1] < possibleKit[row - 1][0]) {
        pkgServings[row].shift();
      }

      if (pkgServings[row].length < 1) return result;
      // possibleKit[row] = pkgServings[row].shift();
      
      // TODO - finish here
      
    }
    
    
      
  }

  
  return result;
}

/**
 * MAIN
 */
(function main() {

  let problems = processInput();

  problems.forEach((problem, i) => {
    DEBUG("Solving case ", (i + 1), "\n", JSON.stringify(problem));
    let result = solve(problem);
    console.log("Case #" + (i + 1) + ": " + result);
  });

})();
