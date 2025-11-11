const express = require("express");
const knex = require("../db/client");

const router = express.Router();

router.get("/taxes", (req, res) => {
  if (req.query.province) {
    knex("taxes")
      .column('tax')
      .where({ area: req.query.province })
      .then((data) => {
        res.send({ status: 200, tax: data[0]?.tax });
      });
  } else {
    res.send({ status: 401 });
  }

});

module.exports = router;
