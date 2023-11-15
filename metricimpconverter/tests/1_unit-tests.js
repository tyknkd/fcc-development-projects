const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

const convertHandler = new ConvertHandler();

const EPSILON = 1e-9;

suite('Unit Tests', function() {
  suite('Numbers', function() {
    // convertHandler should correctly read a whole number input.
    test('whole number input', function() {
      const testCases = { '0gal': 0, '1lbs': 1, '20mi': 20, '30mi': 30 };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getNum(testCase), testCases[testCase]);
      };
    });

    // convertHandler should correctly read a decimal number input.
    test('decimal number input', function() {
      const testCases = { '.1gal': 0.1, '1.01lbs': 1.01, '20.30mi': 20.3, '30.mi': 30 };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getNum(testCase), testCases[testCase]);
      };
    });

    // convertHandler should correctly read a fractional input.
    test('fractional input', function() {
      const testCases = { '0/1gal': 0, '1/2lbs': 0.5, '1/10mi': 0.1 };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getNum(testCase), testCases[testCase]);
      };
      assert.approximately(convertHandler.getNum('1/3mi'), 0.333333333, EPSILON);
      // division by zero
      assert.strictEqual(convertHandler.getNum('1/0mi'), Infinity);
    });

    // convertHandler should correctly read a fractional input with a decimal.
    test('fractional input with decimal', function() {
      const testCases = { '0.1/1gal': 0.1, '0.5/2lbs': 0.25, '1/0.5mi': 2, '20.0/40mi': 0.5 };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getNum(testCase), testCases[testCase]);
      };
    });

    // convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3).
    test('double fraction', function() {
      const testCases = ['1/1/1gal', '0/2/10lbs', '30/2/3lbs', '2/40/2mi', '3/7.2/4kg'];
      for (const testCase of testCases) {
        assert.isString(convertHandler.getNum(testCase), 'error string expected');
      };
    });

    // convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.
    test('no numerical input', function() {
      const testCases = ['gal', 'lbs', 'mi', 'L', 'kg', 'km'];
      for (const testCase of testCases) {
        assert.strictEqual(convertHandler.getNum(testCase), 1);
      };
    });
  });

  suite('Units', function() {
    // convertHandler should correctly read each valid input unit.
    test('valid input unit', function() {
      const testCases = { '1gal': 'gal', '20lbs': 'lbs', '3mi': 'mi', '4/5L': 'L', '2.1kg': 'kg', '20km': 'km', '2KM': 'km', '1GaL': 'gal' };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getUnit(testCase), testCases[testCase]);
      };
    });

    // convertHandler should correctly return an error for an invalid input unit.
    test('invalid input unit', function() {
      const testCases = ['1sho', '20kan', '3 ri', '1', '2.1', '2/5', '3/7.2/4kilomegagram'];
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getUnit(testCase), 'invalid unit');
      };
    });

    // convertHandler should return the correct return unit for each valid input unit.
    test('correct return unit', function() {
      const testCases = { 'gal': 'L', 'lbs': 'kg', 'mi': 'km', 'L': 'gal', 'kg': 'lbs', 'km': 'mi' };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.getReturnUnit(testCase), testCases[testCase]);
      };
    });

    // convertHandler should correctly return the spelled-out string unit for each valid input unit.
    test('spell out unit', function() {
      const testCases = { 'gal': 'gallons', 'lbs': 'pounds', 'mi': 'miles', 'L': 'liters', 'kg': 'kilograms', 'km': 'kilometers' };
      for (const testCase in testCases) {
        assert.strictEqual(convertHandler.spellOutUnit(testCase), testCases[testCase]);
      };
    });
  });

  suite('Conversions', function() {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    // convertHandler should correctly convert gal to L.
    test('convert gal to L', function() {
      const conversion = galToL;
      const unit = 'gal';
      const testCases = [0, 1 / conversion, conversion, 0.01, 0.5, 1, 2, 10, 100, 1000];
      for (const testCase in testCases) {
        assert.approximately(convertHandler.convert(testCase, unit), testCase * conversion, EPSILON);
      };
    });

    // convertHandler should correctly convert L to gal.
    test('convert L to gal', function() {
      const conversion = galToL;
      const unit = 'L';
      const testCases = [0, 1 / conversion, conversion, 0.01, 0.5, 1, 2, 10, 100, 1000];
      for (const testCase in testCases) {
        assert.approximately(convertHandler.convert(testCase, unit), testCase / conversion, EPSILON);
      };
    });

    // convertHandler should correctly convert mi to km.
    test('convert mi to km', function() {
      const conversion = miToKm;
      const unit = 'mi';
      const testCases = [0, 1 / conversion, conversion, 0.01, 0.5, 1, 2, 10, 100, 1000];
      for (const testCase in testCases) {
        assert.approximately(convertHandler.convert(testCase, unit), testCase * conversion, EPSILON);
      };
    });

    // convertHandler should correctly convert km to mi.
    test('convert km to mi', function() {
      const conversion = miToKm;
      const unit = 'km';
      const testCases = [0, 1 / conversion, conversion, 0.01, 0.5, 1, 2, 10, 100, 1000];
      for (const testCase in testCases) {
        assert.approximately(convertHandler.convert(testCase, unit), testCase / conversion, EPSILON);
      };
    });

    // convertHandler should correctly convert lbs to kg.
    test('convert lbs to kg', function() {
      const conversion = lbsToKg;
      const unit = 'lbs';
      const testCases = [0, 1 / conversion, conversion, 0.01, 0.5, 1, 2, 10, 100, 1000];
      for (const testCase in testCases) {
        assert.approximately(convertHandler.convert(testCase, unit), testCase * conversion, EPSILON);
      };
    });

    // convertHandler should correctly convert kg to lbs.
    test('convert kg to lbs', function() {
      const conversion = lbsToKg;
      const unit = 'kg';
      const testCases = [0, 1 / conversion, conversion, 0.01, 0.5, 1, 2, 10, 100, 1000];
      for (const testCase in testCases) {
        assert.approximately(convertHandler.convert(testCase, unit), testCase / conversion, EPSILON);
      };
    });
  });
});