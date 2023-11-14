const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  // Convert a valid input such as 10L: GET request to /api/convert.
  test('GET to /api/convert with valid input', (done) => {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=10L')
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.initNum, 10); 
        assert.equal(res.body.initUnit, 'L');
        assert.equal(res.body.returnNum, 2.64172);
        assert.equal(res.body.returnUnit, 'gal');
        assert.equal(res.body.string, '10 liters converts to 2.64172 gallons');
        done();
      });
  });
  
  // Convert an invalid input such as 32g: GET request to /api/convert.
  test('GET to /api/convert with invalid units', (done) => {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=32g')
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'invalid unit');
        done();
      });
  });
  
  // Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert.
  test('GET to /api/convert with invalid number', (done) => {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=3/7.2/4kg')
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'invalid number');
        done();
      });
  });
  
  // Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert.
  test('GET to /api/convert with invalid number and unit', (done) => {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=3/7.2/4kilomegagram')
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'invalid number and unit');
        done();
      });
  });
  
  // Convert with no number such as kg: GET request to /api/convert.
  test('GET to /api/convert with no number', (done) => {
    chai
      .request(server)
      .keepOpen()
      .get('/api/convert?input=kg')
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.initNum, 1); 
        assert.equal(res.body.initUnit, 'kg');
        assert.equal(res.body.returnNum, 2.20462);
        assert.equal(res.body.returnUnit, 'lbs');
        assert.equal(res.body.string, '1 kilograms converts to 2.20462 pounds');
        done();
     });
  });
});
