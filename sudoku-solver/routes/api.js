'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (puzzle && coordinate && value) {
      const puzzleValidity = solver.validate(puzzle);
      const rowColVal = solver.validateCoordAndValue(coordinate, value);
      if (puzzleValidity.error) {
        res.json(puzzleValidity);
      } else if (rowColVal.error) {
        res.json(rowColVal);
      } else {
        const placementValidity = solver.checkAll(puzzle, rowColVal.row, rowColVal.column, value);
        res.json(placementValidity);
      }
    } else {
      res.json({ error: 'Required field(s) missing' });
    }
  });

  app.route('/api/solve').post((req, res) => {
    const puzzle = req.body.puzzle;
    if (puzzle) {
      res.json(solver.solve(puzzle));
    } else {
      res.json({ error: 'Required field missing' });
    }
  });
};
