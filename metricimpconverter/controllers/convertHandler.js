function ConvertHandler() {

  this.getNum = function(input) {
    // Extract the whole number, decimal, or fraction from a string
    // and return the number
    // If no number in string, return 1
    // If invalid format (i.e., '3/2/3', '1kg2'), return error string ('invalid number')
    // Whitespace in string not permitted

    // Regular expressions for number strings
    const digits = /\d+/;
    const decimal = /\d*\.\d*/;
    const fraction = /(\d*\.?\d*)\/(\d*\.?\d*)/;

    // RegEx for number and unit but no extraneous numbers
    const intUnit = /^\d+(?![/.])([A-Za-z]*)(?!\d)$/;
    const decimalUnit = /^\d*\.\d*([A-Za-z]*)(?!\d)$/;
    const fractionUnit = /^(\d*\.?\d*)\/(\d*\.?\d*)(?!\/)([A-Za-z]*)(?!\d)$/;

    // If input contains a number
    if (digits.test(input)) {
      // Check for valid integer
      if (intUnit.test(input)) {
        // Return integer
        return Number(input.match(digits)[0]);
      }
      // Check for valid fraction
      else if (fractionUnit.test(input)) {
        // Get array of fraction, numerator, and denominator
        const fracArray = input.match(fraction);
        // Return fraction as float
        return Number(fracArray[1]) / Number(fracArray[2]);
      }
      // Check for valid decimal
      else if (decimalUnit.test(input)) {
        // Return decimal
        return Number(input.match(decimal)[0]);
      }

      // Otherwise, return error
      else {
        return 'invalid number';
      }
    } else {
      // No number in input
      return 1;
    }
  };

  this.getUnit = function(input) {
    // Extract the unit from a string
    // Accept upper or lower case input,
    // but return lower case unit, except 'L'
    // Return 'invalid unit' if invalid

    const alphaRegEx = /[A-Za-z]+/;
    const validUnits = /^(gal)$|^(lbs)$|^(mi)$|^(l)$|^(kg)$|^(km)$/;

    // If input contains alphabet characters
    if (alphaRegEx.test(input)) {
      // Extract that string
      const initUnit = input.match(alphaRegEx)[0].toLowerCase();
      // Check if valid unit
      if (validUnits.test(initUnit)) {
        // If liters
        if (initUnit === 'l') {
          return 'L';
        } else { return initUnit; }
      }
    }
    return 'invalid unit'
  };

  this.getReturnUnit = function(initUnit) {
    // Return correct conversion unit for each input unit
    switch (initUnit) {
      case 'gal':
        return 'L';
      case 'lbs':
        return 'kg';
      case 'mi':
        return 'km';
      case 'L':
        return 'gal';
      case 'kg':
        return 'lbs';
      case 'km':
        return 'mi';
      default:
        return 'error'
    }
  };

  this.spellOutUnit = function(unit) {
    // Return unabbreviated unit
    switch (unit) {
      case 'gal':
        return 'gallons';
      case 'lbs':
        return 'pounds';
      case 'mi':
        return 'miles';
      case 'L':
        return 'liters';
      case 'kg':
        return 'kilograms';
      case 'km':
        return 'kilometers';
      default:
        return 'error'
    }
  };

  this.convert = function(initNum, initUnit) {
    // Return converted number
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    switch (initUnit) {
      case 'gal':
        return initNum * galToL;
      case 'lbs':
        return initNum * lbsToKg;
      case 'mi':
        return initNum * miToKm;
      case 'L':
        return initNum / galToL;
      case 'kg':
        return initNum / lbsToKg;
      case 'km':
        return initNum / miToKm;
      default:
        return 'error'
    }
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    // return formatted string
    // i.e., '1 miles converts to 1.60934 kilometers'
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`
  };

  this.getJSON = function(input) {
    // Return JSON for conversion of input string
    // or return error message

    // Get input number
    const initNum = this.getNum(input);
    
    // Get input unit
    const initUnit = this.getUnit(input);
    
    // If invalid input, return error
    if (typeof initNum === 'string') {
      if (initUnit === 'invalid unit') {
        return 'invalid number and unit';
      }
      else {
        return 'invalid number';
      }
    }
    else if (initUnit === 'invalid unit') {
      return 'invalid unit';
    }
    else { 
      // Get converted number
      let returnNum = this.convert(initNum, initUnit);
      if (!returnNum.isInteger) {
        returnNum = Number(returnNum.toFixed(5));
      }

      // Get converted unit
      const returnUnit = this.getReturnUnit(initUnit);

      // Get return string
      const returnString = this.getString(initNum, initUnit, returnNum, returnUnit);

      // Return JSON
      return {
        'initNum': initNum,
        'initUnit': initUnit,
        'returnNum': returnNum,
        'returnUnit': returnUnit,
        'string': returnString
      };
    }
  };
}

module.exports = ConvertHandler;
