'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');


//generating the salt. using the bcrypt.hash() func and
// insert the emailed hashed password into the users table.
router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
  .then((hashed_password) => {
    // console.log(req.body.email, hashed_password);
    return knex('users')
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      hashed_password: hashed_password
    }, '*');
  })
  .then((users) => {
    const user = users[0];
    console.log('user', user);
    console.log("this is reqbody", req.body);
    delete user.hashed_password;
    res.send(user);
  })
  .catch((err) => {
    next(err);
  });
});
//

module.exports = router;
