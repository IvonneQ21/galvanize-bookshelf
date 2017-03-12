'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const coockie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const forKey = require('dotenv')


// YOUR CODE HERE

router.get('/token', (req, res, next) => {
  knex('users')
  .then((usersTable) => {
    // console.log('This is the usertable',usersTable);
    let userPass ;
    if(!req.cookies.token){
      userPass = false;
      } else {
        userPass = true;
      }
    res.set('content-Type', 'application/json');
    res.send(userPass);
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/token', (req, res, next) => {
 return knex('users')
    .where('email', req.body.email)
    .then((userInfo) => {
      let user = userInfo[0];
      if(!user) {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      }
        let nonHashedgivenPass = req.body.password ;
        let storedPass = user.hashed_password;
    bcrypt.compare(nonHashedgivenPass, storedPass)
    .then(( passedCompar ) => {
      delete user.hashed_password;
      const claim = {userId: user.id};
      const token = jwt.sign(claim, process.env.JWT_KEY, { expiresIn: '7 days'})
         res.cookie('token', token, {
              path: '/',
              httpOnly: true,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
              secure: router.get('env') === 'development'
            });

            res.status(200).send(humps.camelizeKeys(user));
    })
      .catch((passedComp) => {
        res.set('Content-Type', 'plain/text');
        res.status(400);
        res.send('Bad email or password')
      })
    })
})

router.DELETE('/token', (req, res, next) => {
  return knex('users')
  .
})



module.exports = router;
