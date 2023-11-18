'use strict';

const { Book } = require('../models');

module.exports = function(app) {

  app.route('/api/books')
    .get((req, res) => {
      // Get array of all books
      Book.find({}).then((books) => {
        if (books.length > 0) {
          books = books.map((book) => ({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
            comments: book.comments
          }));
        }
        res.json(books);
      }).catch((error) => console.error(error));
    })

    .post((req, res) => {
      // Add book by title
      const title = req.body.title;
      if (title) {
        Book.create({ title: title }).then((book) => {
          if (book) {
            res.json({
              _id: book._id,
              title: book.title
            });
          }
        }).catch((error) => console.error(error));
      } else {
        res.send('missing required field title');
      }
    })

    .delete((req, res) => {
      // Remove all books from database
      Book.deleteMany({}).then((deleteResult) => {
        if (deleteResult) {
          res.send('complete delete successful');
        }
      }).catch((error) => console.error(error));
    });



  app.route('/api/books/:id')
    .get((req, res) => {
      // Get book by id
      const bookid = req.params.id;
      if (bookid) {
        Book.findOne({ _id: bookid }).then((book) => {
          if (book) {
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comments
            });
          } else {
            res.send('no book exists');
          }
        }).catch((error) => console.error(error));
      }
    })

    .post((req, res) => {
      // Add comment to book with id
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (comment) {
        if (bookid) {
          const filter = { _id: bookid };
          Book.findOne(filter).then((book) => {
            if (book) {
              book.comments.push(comment)
              const update = {
                title: book.title,
                comments: book.comments
              };
              Book.updateOne(filter, update).then((updateResult) => {
                if (updateResult && updateResult.modifiedCount > 0) {
                  res.json({
                    _id: bookid,
                    title: book.title,
                    commentcount: book.comments.length,
                    comments: book.comments
                  });
                }
              }).catch((error) => console.error(error));
            } else {
              res.send('no book exists');
            }
          }).catch((error) => console.error(error));
        }
      } else {
        res.send('missing required field comment');
      }
    })

    .delete(function(req, res) {
      // Remove book by id
      const bookid = req.params.id;
      if (bookid) {
        Book.deleteOne({ _id: bookid }).then((deleteResult) => {
          if (deleteResult && deleteResult.deletedCount > 0) {
            res.send('delete successful');
          } else {
            res.send('no book exists');
          }
        }).catch((error) => console.error(error));
      }
    });
};
