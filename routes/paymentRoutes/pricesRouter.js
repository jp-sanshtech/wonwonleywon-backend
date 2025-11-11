const express = require('express');
const router = express.Router();
const knex = require('../../db/client');


router.get('/price-with-shipping', async (req, res) => {
  const { id, tid } = req.query;
  if (id && tid) {
    try {
      const priceData = await knex('products').columns('priceUs', 'name').where({ id });
      const shippingArr = await knex('shippings').columns('countryId', 'price').where({ typeId: tid }).orderBy('id', 'desc');
      res.send({ status: 200, shippingArr, priceUs: priceData[0].priceUs, productName: priceData[0].name })
    } catch (error) {
      console.log(error)
      res.send({ status: 501 })
    }
  } else {
    res.send({ status: 401 })
  }
})



module.exports = router;