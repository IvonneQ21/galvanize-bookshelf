'use strict';

const express = require('express');
const router = express.Router();
const knex = require("../knex");
const jwt = require('jsonwebtoken');
const {
   camelizeKeys,
   decamelizeKeys
} = require('humps');
let tokenID ;
const authorize = function(req, res, next) {
 jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
   if (err) {
     res.set("Content-Type", "text/plain");
     return res.status(401).send('Unauthorized');
   } else {
  tokenID = payload.userId;
   next();
 }
 });
};

router.get('/favorites', authorize, (req, res, next) => {
 knex('favorites')
 .innerJoin('books', 'books.id', 'favorites.book_id')
 .where('favorites.user_id', req.claim.userId)
 .orderBy('books.title', 'ASC')
 .then((rows) => {
   const favorites = camelizeKeys(rows);

   res.send(favorites);
 })
 .catch((err) => {
   next(err);
 });
});

router.get('/favorites/check', authorize, (req, res, next) => {
 const bookId = req.query.bookId;
 knex('favorites')
  .innerJoin('books', 'books.id', 'favorites.book_id')
  .where('favorites.book_id', bookId)
  .orderBy('books.title', 'ASC')
  .then((book) => {
    if(book[0]){
      res.send(true)
    } else {
      res.send(false);
    }
  })
    .catch((err) => {
      res.send(err);
    })
})

router.post('/favorites', authorize, (req, res, next)=> {
  const bookId = req.body.bookId;
  knex('favorites')
  .insert([{
    'book_id': bookId,
    'user_id': tokenId
  }])
  .returning('*')
  .then((book) => {
    res.send(camelizeKeys(book[0]));
  })
  .catch((err) => {
    console.err(err);
  })
})

router.delete('/favorites', authorize, (req, res, next) => {
  const bookId = req.body.bookId;
  let deletedBook;
  knex("favorites")
  .where("book_id", bookId)
  .then((book) => {
    deletedBook = book[0];
    if (!deletedBook) {
      return next()
    }
    return knex("favorites")
    .del()
    .where("book_id", bookId)
  }).then(() => {
    delete deletedBook.id;
    res.json(camelizeKeys(deletedBook));
  })
  .catch((err) => {
    next(err);
  });
});


module.exports = router;
