class SudokuSolver {
  length = 81;
  rows = 9;

  validate(puzzleString) {
    if (puzzleString.length != this.length) {
      return { error: `Expected puzzle to be ${this.length} characters long` };
    }
    const invalidChar = /[^1-9.]/;
    if (invalidChar.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  validateCoordAndValue(coordinate, value) {
    if (!/^[1-9]$/.test(value)) {
      return { error: 'Invalid value' };
    } else if (/^[A-Ia-i][1-9]$/.test(coordinate)) {
      const conversion = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9 };
      return { valid: true, row: conversion[coordinate[0].toUpperCase()], column: Number(coordinate[1]), value: Number(value) };
    }
    else { return { error: 'Invalid coordinate' }; }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const idx = (row - 1) * this.rows + column - 1;
    for (let i = (row - 1) * this.rows; i < (row - 1) * this.rows + this.rows; i++) {
      if (puzzleString[i] == value && i != idx) {
        return { valid: false, conflict: ['row'] };
      }
    }
    return { valid: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    const idx = (row - 1) * this.rows + column - 1;
    for (let i = column - 1; i < column + this.length - this.rows; i += this.rows) {
      if (puzzleString[i] == value && i != idx) {
        return { valid: false, conflict: ['column'] };
      }
    }
    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const selfIdx = (row - 1) * this.rows + column - 1;
    const topRow = Math.ceil(row / 3) * 3 - 2;
    const leftCol = Math.ceil(column / 3) * 3 - 2;
    const upperLeftIdx = (topRow - 1) * this.rows + leftCol - 1;
    for (let i = upperLeftIdx; i < upperLeftIdx + 3; i++) {
      for (let j = 0; j < 3; j++) {
        const idx = i + this.rows * j;
        if (puzzleString[idx] == value && idx != selfIdx) {
          return { valid: false, conflict: ['region'] };
        }
      }
    }
    return { valid: true };
  }

  checkAll(puzzleString, row, column, value) {
    const result = { valid: true, conflict: [] }
    const rowPlacement = this.checkRowPlacement(puzzleString, row, column, value);
    const colPlacement = this.checkColPlacement(puzzleString, row, column, value);
    const regionPlacement = this.checkRegionPlacement(puzzleString, row, column, value);
    if (!rowPlacement.valid) {
      result.valid = false;
      result.conflict.push(rowPlacement.conflict[0]);
    }
    if (!colPlacement.valid) {
      result.valid = false;
      result.conflict.push(colPlacement.conflict[0]);
    }
    if (!regionPlacement.valid) {
      result.valid = false;
      result.conflict.push(regionPlacement.conflict[0]);
    }
    if (!result.valid) {
      return result;
    } else {
      // All 3 properties are valid,
      // so arbitrarily return any as result
      return rowPlacement;
    }
  }

  solve(puzzleString) {
    // Validate string
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return validation;
    }

    // Convert string to array of integers, replace period with zero
    const puzzleArr = puzzleString.split('').map((elem) => (elem == '.' ? 0 : parseInt(elem)));
    // Recurse until solved
    if (this.recursiveSolver(puzzleArr)) {
      // Return as string
      const solution = puzzleArr.join('');
      return { solution: solution };
    } else {
      // Impossible puzzle
      return { error: 'Puzzle cannot be solved' };
    }
  }

  recursiveSolver(puzzleArr) {
    // Check for unfilled values (i.e., 0)
    let i = 0;
    let solved = true;
    for (; i < this.length; i++) {
      if (puzzleArr[i] == 0) {
        solved = false;
        break;
      }
    }
    if (solved) {
      return true;
    }

    // Find valid value if possible
    const row = Math.floor(i / this.rows) + 1;
    const column = i % this.rows + 1;

    for (let value = 1; value < 10; value++) {
      // If value satisfies sudoku invariant
      if (this.checkAll(puzzleArr, row, column, value).valid) {
        puzzleArr[i] = value;

        // Recursively solve remaining blanks
        if (this.recursiveSolver(puzzleArr)) {
          return true;
        } else {
          // Not possible with this value,
          // so reset and try next value
          puzzleArr[i] = 0;
        }
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;

