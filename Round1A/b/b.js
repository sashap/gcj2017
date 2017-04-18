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

/**
 *  START
 */
var rw = require('rw');
var inputLines = rw.readFileSync("/dev/stdin", "utf8").split('\n');


let problems = [];
let T = parseInt(inputLines.shift());
for (let problem = 0; problem < T; problem++) {
  let NPLine = inputLines.shift().split(' ');
  let N = parseInt(NPLine[0]);
  let P = parseInt(NPLine[1]);

  let recipe = inputLines.shift().split(' ').map((el) => parseInt(el));
  let packages = [];
  for (let Q = 0; Q < N; Q++) {
    packages.push(inputLines.shift().split(' ').map((el) => parseInt(el)));
  }
  problems.push({
    numIngredients: N,
    numPackages: P,
    recipe: recipe,
    packages: packages
  });
}


INFO("Input");
INFO("-----");
INFO(inputLines.join('\n'));
INFO("");
DEBUG("Test Cases:", JSON.stringify(problems));

INFO("Output");
INFO("-----");
problems.forEach((problem, i) => {
  DEBUG("Solving case ", (i + 1), "\n", JSON.stringify(problem));
  let result = solve(problem);
  console.log("Case #" + (i + 1) + ": " + result);
});


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
      let min = problem.packages[i][j] / (problem.recipe[i] * 1.1);
      let max = problem.packages[i][j] / (problem.recipe[i] * 0.9);
      let minMax = [
        // e.g. (1350 / ( 3 * 0.9 )) raw: 499.99999999999994
        // should be 500, but floor of that would be 499
        // due to precision errors in JS, check for delta (1e-9)
        Math.abs(Math.floor(min) - min) < 1e-9 ? Math.floor(min) : Math.ceil(min),
        Math.abs(Math.ceil(max) - max) < 1e-9 ? Math.ceil(max) : Math.floor(max)
      ];
      DEBUG("  min = Math.ceil(", problem.packages[i][j], "/ (", problem.recipe[i], "*", 1.1 ,"))", "raw:", problem.packages[i][j] / (problem.recipe[i] * 1.1));
      DEBUG("  max = Math.floor(", problem.packages[i][j], "/ (", problem.recipe[i], "*", 0.9 ,"))", "raw:", problem.packages[i][j] / (problem.recipe[i] * 0.9));
      if (minMax[0] <= minMax[1]) {
        pkgServings[i].push(minMax);
      } else {
        DEBUG("  excluding min > max", minMax, " package size: ", problem.packages[i][j], "  recipe amount: ", problem.recipe[i]);
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
  while (pkgServings[0].length > 0) {
    let min = pkgServings[0][0][0];
    let max = pkgServings[0][0][1];
    let validKit = true;

    for (let r = 0; r < pkgServings.length; r++) {
      let row = pkgServings[r];
      // current max < min ?
      while (row.length && row[0][1] < min) {
        row.shift();
      }

      if (!row.length) {
        return result;
      }

      // current min > max ?
      if (row[0][0] > max) {
        // shift all above rs
        for (let shiftR = 0; shiftR < r; shiftR++) {
          pkgServings[shiftR].shift();
        }
        validKit = false;
        break;
      }

      // current value is within bounds of min & max
      min = row[0][0] > min ? row[0][0] : min;
      max = row[0][1] < max ? row[0][1] : max;
    }

    if (validKit) {
      result++;
      let kit = [];
      pkgServings.forEach((row) => {
        kit.push(row.shift());
      });
      kits.push(kit);
      DEBUG('>>> Formed valid kit: ', kit);
    }
  }

  return result;
}
