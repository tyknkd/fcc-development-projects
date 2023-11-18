const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);

  suite('Routing tests', function() {
    const url = '/api/books';
    let input = {
      title: '1984',
      id: '',
      fake_id: '0123456789abcdef01234567',
      comment: 'excellent'
    };
    
    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .keepOpen()
          .post(url)
          .type('form')
          .send(input)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            input.id = res.body._id;
            assert.equal(res.body.title, input.title);
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .keepOpen()
          .post(url)
          .type('form')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .keepOpen()
          .get(url)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .keepOpen()
          .get(url + '/' + input.fake_id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .keepOpen()
          .get(url + '/' + input.id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments)
            assert.equal(res.body.title, input.title);
            done();
          });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
          .keepOpen()
          .post(url + '/' + input.id)
          .type('form')
          .send(input)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.property(res.body, 'commentcount');
            assert.equal(res.body.title, input.title);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .keepOpen()
          .post(url + '/' + input.id)
          .type('form')
          .send({ id: input.id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .keepOpen()
          .post(url + '/' + input.fake_id)
          .type('form')
          .send(input)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
        .keepOpen()
        .delete(url + '/' + input.id)
        .type('form')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html');
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        chai.request(server)
        .keepOpen()
        .delete(url + '/' + input.fake_id)
        .type('form')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html');
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
    });
  });
});
