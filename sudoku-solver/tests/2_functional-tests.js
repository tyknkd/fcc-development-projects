const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(10000);
  const validStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidCharStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3a.6..';
  const invalidLengthStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
  const unsolvableStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.8';

  suite('POST to /api/solve', function() {
    const url = '/api/solve';
    test('Solve valid puzzle', (done) => {
      const input = { puzzle: puzzlesAndSolutions[0][0] };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });

    test('Missing puzzle', (done) => {
      const input = {};
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Invalid characters', (done) => {
      const input = { puzzle: invalidCharStr };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Invalid length', (done) => {
      const input = { puzzle: invalidLengthStr };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Unsolvable puzzle', (done) => {
      const input = { puzzle: unsolvableStr };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST to /api/check', function() {
    const url = '/api/check';

    test('Valid placement check', (done) => {
      const input = { puzzle: validStr, coordinate: 'H7', value: 8 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Valid existing value placement check', (done) => {
      const input = { puzzle: validStr, coordinate: 'H8', value: 3 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Single placement conflict', (done) => {
      const input = { puzzle: validStr, coordinate: 'H7', value: 5 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, 'row');
          done();
        });
    });

    test('Multiple placement conflicts', (done) => {
      const input = { puzzle: validStr, coordinate: 'H7', value: 4 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('All placement conflicts', (done) => {
      const input = { puzzle: validStr, coordinate: 'D3', value: 9 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Incomplete placement check', (done) => {
      const input = {};
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Invalid puzzle characters placement check', (done) => {
      const input = { puzzle: invalidCharStr, coordinate: 'H7', value: 8 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Invalid puzzle length placement check', (done) => {
      const input = { puzzle: invalidLengthStr, coordinate: 'H7', value: 8 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Invalid coordinate placement check', (done) => {
      const input = { puzzle: validStr, coordinate: 'J10', value: 8 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Invalid value placement check', (done) => {
      const input = { puzzle: validStr, coordinate: 'H7', value: 10 };
      chai
        .request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});
