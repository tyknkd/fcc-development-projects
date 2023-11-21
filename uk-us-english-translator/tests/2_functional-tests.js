const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

// let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  const url = '/api/solve';

  // Translation with text and locale fields: POST request to /api/translate
  test('Translate valid text and locale', (done) => {
    const input = { text: 'Can you toss this in the trashcan for me?', locale: 'american-to-british' };
    const expected = { text: 'Can you toss this in the trashcan for me?', translation: 'Can you toss this in the <span class="highlight">bin</span> for me?' };
    chai
      .request(server)
      .keepOpen()
      .post(url)
      .type('form')
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.property(res.body, 'text');
        assert.equal(res.body.text, expected.text);
        assert.property(res.body, 'translation');
        assert.equal(res.body.translation, expected.translation);
        done();
      });
  });

  // Translation with text and invalid locale field: POST request to /api/translate
  test('Translate valid text and invalid locale', (done) => {
    const input = { text: 'Can you toss this in the trashcan for me?', locale: 'jamaican-to-british' };
    const expected = { error: 'Invalid value for locale field' };
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
        assert.equal(res.body.error, expected.error);
        done();
      });
  });

  // Translation with missing text field: POST request to /api/translate
  test('Translate missing text and valid locale', (done) => {
    const input = { locale: 'american-to-british' };
    const expected = { error: 'Required field(s) missing' };
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
        assert.equal(res.body.error, expected.error);
        done();
      });
  });

  // Translation with missing locale field: POST request to /api/translate
  test('Translate valid text and missing locale', (done) => {
    const input = { text: 'Can you toss this in the trashcan for me?' };
    const expected = { error: 'Required field(s) missing' };
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
        assert.equal(res.body.error, expected.error);
        done();
      });
  });

  // Translation with empty text: POST request to /api/translate
  test('Translate empty text and valid locale', (done) => {
    const input = { text: '', locale: 'american-to-british' };
    const expected = { error: 'No text to translate' };
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
        assert.equal(res.body.error, expected.error);
        done();
      });
  });

  // Translation with text that needs no translation: POST request to /api/translate
  test('Translate text that needs no translation', (done) => {
    const input = { text: 'Hello', locale: 'american-to-british' };
    const expected = { text: 'Hello', translation: 'Everything looks good to me!' };
    chai
      .request(server)
      .keepOpen()
      .post(url)
      .type('form')
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.property(res.body, 'text');
        assert.equal(res.body.text, expected.text);
        assert.property(res.body, 'translation');
        assert.equal(res.body.translation, expected.translation);
        done();
      });
  });
});
