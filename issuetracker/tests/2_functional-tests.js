const chaiHttp = require('chai-http');
const chai = require('chai');
const chaiDateTime = require('chai-datetime');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
chai.use(chaiDateTime);

suite('Functional Tests', function() {
  this.timeout(5000);
  const url = '/api/issues/apitest';
  const input = {
    issue_title: 'all fields title',
    issue_text: 'all fields text',
    created_by: 'creator',
    assigned_to: 'all fields assignee',
    status_text: 'all fields status'
  };
  let issue_id;

  suite('POST Tests', function() {
    // Create an issue with every field
    test('POST all fields to /api/issues/{project}', (done) => {
      chai.request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, input.issue_title);
          assert.equal(res.body.issue_text, input.issue_text);
          assert.equal(res.body.created_by, input.created_by);
          assert.equal(res.body.assigned_to, input.assigned_to);
          assert.equal(res.body.status_text, input.status_text);
          assert.isTrue(res.body.open, 'open expected to be true');
          assert.beforeOrEqualDate(new Date(res.body.created_on), new Date());
          assert.beforeOrEqualDate(new Date(res.body.updated_on), new Date());
          done();
        });
    });

    // Create an issue with only required fields
    test('POST only required fields', (done) => {
      const partial_input = {
        issue_title: 'required fields title',
        issue_text: 'required fields text',
        created_by: 'creator'
      };
      chai.request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(partial_input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, partial_input.issue_title);
          assert.equal(res.body.issue_text, partial_input.issue_text);
          assert.equal(res.body.created_by, partial_input.created_by);
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.isTrue(res.body.open, 'open expected to be true');
          assert.beforeOrEqualDate(new Date(res.body.created_on), new Date());
          assert.beforeOrEqualDate(new Date(res.body.updated_on), new Date());
          issue_id = res.body._id;
          done();
        });
    });

    // Create an issue with missing required fields
    test('POST missing required fields', (done) => {
      const incomplete_input = {
        issue_title: 'required fields title',
        issue_text: 'required fields text'
      };
      chai.request(server)
        .keepOpen()
        .post(url)
        .type('form')
        .send(incomplete_input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('GET Tests', function() {
    // View all issues on a project
    test('GET all issues from /api/issues/{project}', (done) => {
      chai.request(server)
        .keepOpen()
        .get(url)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
	  assert.isArray(res.body, 'response should be array');
          done();
        });
    });

    // View issues on a project with one filter
    test('GET issues with one filter', (done) => {
      chai.request(server)
        .keepOpen()
        .get(url)
        .query({ created_by: input.created_by })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body[0].created_by, input.created_by);
          done();
        });
    });

    // View issues on a project with multiple filters
    test('GET issues with multiple filters', (done) => {
      chai.request(server)
        .keepOpen()
        .get(url)
        .query({ created_by: input.created_by, issue_title: input.issue_title })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body[0].created_by, input.created_by);
          assert.equal(res.body[0].issue_title, input.issue_title);
          done();
        });
    });
  });

  suite('PUT Tests', function() {
    // Update one field of an issue
    test('PUT update one field of issue', (done) => {
      const update = { _id: issue_id, issue_title: 'update title only' };
      chai.request(server)
        .keepOpen()
        .put(url)
        .type('form')
        .send(update)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, update._id);
          done();
        });
    });

    // Update multiple fields of an issue
    test('PUT update multiple fields of issue', (done) => {
      const update = { _id: issue_id, issue_title: 'update title', issue_text: 'update text' };
      chai.request(server)
        .keepOpen()
        .put(url)
        .type('form')
        .send(update)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, update._id);
          done();
        });
    });

    // Update an issue without id
    test('PUT update issue without id', (done) => {
      const update = { issue_title: 'update title' };
      chai.request(server)
        .keepOpen()
        .put(url)
        .type('form')
        .send(update)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    // Update an issue without fields to update
    test('PUT update issue without update fields', (done) => {
      const update = { _id: issue_id };
      chai.request(server)
        .keepOpen()
        .put(url)
        .type('form')
        .send(update)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, update._id);
          done();
        });
    });

    // Update an issue with an invalid _id
    test('PUT update issue with invalid id', (done) => {
      const update = { _id: '0123456789abcdef01234567', issue_title: 'update title' };
      chai.request(server)
        .keepOpen()
        .put(url)
        .type('form')
        .send(update)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, update._id);
          done();
        });
    });
  });

  suite('DELETE Tests', function() {
    // Delete an issue
    test('DELETE an issue', (done) => {
      const issue = { _id: issue_id };
      chai.request(server)
        .keepOpen()
        .delete(url)
        .type('form')
        .send(issue)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, issue._id);
          done();
        });
    });

    // Delete an issue with an invalid _id
    test('DELETE an issue using invalid id', (done) => {
      const issue = { _id: '0123456789abcdef01234567' };
      chai.request(server)
        .keepOpen()
        .delete(url)
        .type('form')
        .send(issue)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, issue._id);
          done();
        });
    });

    // Delete an issue with missing _id
    test('DELETE an issue without id', (done) => {
      const issue = { empty: '' };
      chai.request(server)
        .keepOpen()
        .delete(url)
        .type('form')
        .send(issue)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
