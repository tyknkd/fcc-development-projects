const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')

suite('Unit Tests', function() {
  this.timeout(10000);

  const validStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidCharStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3a.6..';
  const invalidLengthStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
  const unsolvableStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.8';

  suite('Validate String', function() {
    test('valid string', () => {
      assert.isTrue(solver.validate(validStr).valid);
    })

    test('invalid characters', () => {
      assert.equal(solver.validate(invalidCharStr).error, 'Invalid characters in puzzle');
    });

    test('invalid length', () => {
      assert.equal(solver.validate(invalidLengthStr).error, 'Expected puzzle to be 81 characters long');
    });
  });

  suite('Check Placement', function() {
    test('valid row placement', () => {
      const testCases = [{ row: 1, col: 1, value: 7 }, { row: 4, col: 3, value: 4 }, { row: 8, col: 7, value: 8 }];
      for (const testCase of testCases) {
        assert.isTrue(solver.checkRowPlacement(validStr, testCase.row, testCase.col, testCase.value).valid);
      }
    });

    test('invalid row placement', () => {
      const testCases = [{ row: 1, col: 1, value: 9 }, { row: 4, col: 3, value: 6 }, { row: 8, col: 7, value: 5 }];
      for (const testCase of testCases) {
        assert.isFalse(solver.checkRowPlacement(validStr, testCase.row, testCase.col, testCase.value).valid);
      }
    });

    test('valid column placement', () => {
      const testCases = [{ row: 1, col: 1, value: 7 }, { row: 4, col: 3, value: 4 }, { row: 8, col: 7, value: 8 }];
      for (const testCase of testCases) {
        assert.isTrue(solver.checkColPlacement(validStr, testCase.row, testCase.col, testCase.value).valid);
      }
    });

    test('invalid column placement', () => {
      const testCases = [{ row: 1, col: 1, value: 6 }, { row: 4, col: 3, value: 2 }, { row: 8, col: 7, value: 1 }];
      for (const testCase of testCases) {
        assert.isFalse(solver.checkColPlacement(validStr, testCase.row, testCase.col, testCase.value).valid);
      }
    });

    test('valid region placement', () => {
      const testCases = [{ row: 1, col: 1, value: 7 }, { row: 4, col: 3, value: 4 }, { row: 8, col: 7, value: 8 }];
      for (const testCase of testCases) {
        assert.isTrue(solver.checkRegionPlacement(validStr, testCase.row, testCase.col, testCase.value).valid);
      }
    });

    test('invalid region placement', () => {
      const testCases = [{ row: 1, col: 1, value: 3 }, { row: 4, col: 3, value: 6 }, { row: 8, col: 7, value: 9 }];
      for (const testCase of testCases) {
        assert.isFalse(solver.checkRegionPlacement(validStr, testCase.row, testCase.col, testCase.value).valid);
      }
    });
  });

  suite('Solver', function() {
    test('valid puzzles pass solver', () => {
      for (const puzzle of puzzlesAndSolutions) {
        assert.property(solver.solve(puzzle[0]), 'solution');
      }
    });

    test('invalid puzzles fail solver', () => {
      assert.property(solver.solve(invalidCharStr), 'error');
      assert.property(solver.solve(invalidLengthStr), 'error');
      assert.property(solver.solve(unsolvableStr), 'error');
    });

    test('solve valid puzzles with expected solution', () => {
      for (const puzzle of puzzlesAndSolutions) {
        assert.equal(solver.solve(puzzle[0]).solution, puzzle[1]);
      }
    });
  });
});
