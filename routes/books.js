'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();

// YOUR CODE HERE
router.get('/books', (req, res, next) => {
  knex('books')
  .orderBy('title', 'asc')
  .then((book) => {
    res.set('content-Type', 'application/json')
    res.send(humps.camelizeKeys(book));
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
  .orderBy('title', 'asc')
  .where('id', req.params.id)
  .then((book) => {
    if(!book){
      return next();
    }
    res.set('content-Type', 'application/json');
    res.send(humps.camelizeKeys(book)[0]);
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/books', (req, res, next) => {
  knex('books')
  .insert({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }, '*')
  // .into('books')
  .then((book) => {
    if(!book){
      return nex();
    }
    res.set('content-Type', 'application/json');
    res.send(humps.camelizeKeys(book)[0]);
  })
  .catch((err) => {
    next(err);
  });
});

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      return knex('books')
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        }, '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      res.send(humps.camelizeKeys(books)[0]);
    })
    .catch((err) => {
      next(err);
    });
});
router.delete('/books/:id', (req, res, next) => {
  let book;
  knex('books')
  .where('id', req.params.id)
  .then((row) => {
    if(!row){
      return next();
    }
    book = row;
    return knex('books')
    .del()
    .where('id', req.params.id);
  })
  .then(() => {
    delete book[0].id;
    res.send(humps.camelizeKeys(book)[0]);
  })
  .catch((err) => {
    next(err);
  });
});


module.exports = router;
