const express = require("express");
const knex = require('../db/client')
const router = express.Router();




router.get('/get-vid-by-pid', (req, res) => {
  const { id } = req.query;
  if (id) {
    knex('videos').select('*').returning('*').where({ 'pid': id })
      .then(data => {
        res.send({ status: 200, vids: data });
      })
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
})








module.exports = router;
