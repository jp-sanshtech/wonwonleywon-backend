const express = require('express');

const router = express.Router();
const knex = require('../db/client');

router.post('/user', (req, res) => {
  const params = {
    name: req.body.data.name,
    email: req.body.data.email,
    address: req.body.data.address,
    country: req.body.data.country,
    city: req.body.data.city,
    postalCode: req.body.data.postalCode,
    state: req.body.data.state,
  };
  knex('users').insert(params).returning('*').then(data => {
    knex('orders').where({ id: req.body.data.orderId }).update({
      orderCode: req.body.data.checkoutCode,
      userId: data.id,
      checkoutCode: req.body.data.checkoutCode,
      status: 1,
    }).returning("*").then(e => {
      console.log(e);

    });
  });
  res.send({ status: 200 });
});

module.exports = router;
