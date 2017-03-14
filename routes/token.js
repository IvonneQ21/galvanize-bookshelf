'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const coockieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const forKey = require('dotenv')
const myKey = process.env.JTW_KEY;


// YOUR CODE HERE

router.get('/token', (req, res, next) => {
    if(!req.cookies.token){
      res.set('content-Type', 'application/json');
      res.send('false');
    } else {
        res.set('content-Type', 'application/json');
        res.send('true');
    }
});

router.post('/token', (req, res, next) => {
 return knex('users').where('email', req.body.email)
    .then((userInfo) => {
      let user = userInfo[0];
      if(!user) {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      } else {
        let nonHashedgivenPass = req.body.password;
        let storedPass = user.hashed_password;
    return bcrypt.compare(nonHashedgivenPass, storedPass)
    .then(( passedCompar ) => {
      delete user.hashed_password;
      const claim = {userId: user.id, iss:'https://localhost:8000'};
      const token = jwt.sign(claim, process.env.JWT_KEY)
         res.cookie('token', token, {
              path: '/',
              httpOnly: true,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
              secure: router.get('env') === 'development'
            });

            res.status(200).send(humps.camelizeKeys(user))
            res.clearCookie();
    })
      .catch((passedComp) => {
        res.set('Content-Type', 'plain/text');
        res.status(400);
        res.send('Bad email or password')
      })
    }
    })
})

router.delete('/token', (req, res, next) => {
  return knex('users')
    .then((usersToEdit) => {
      res.clearCookie('token', {path:'/'});
      res.set('Content-Type', 'text/plain');
      res.status(200).send('true')
    })
})



module.exports = router;
