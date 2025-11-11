const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.get("/product-owner", (req, res) => {
  const { productId } = req.query;
  knex("productOwnership")
    .select("*")
    .where({ productId })
    .then((data) => {
      res.send(data);
    });
});

router.get("/all-product-owner", (req, res) => {
  knex("productOwnership")
    .select("*")
    .then((data) => {
      res.send(data);
    });
});

router.post("/product-owner", (req, res) => {
  const params = {
    productId: req.body.productId,
    email: req.body.email,
  };
  knex("productOwnership")
    .insert(params)
    .returning("id")
    .then((data) => {
      res.send(data);
    });
});

router.patch("/product-owner", (req, res) => {
  const patchParams = {
    productId: req.body.productId,
    email: req.body.email,
  };
  knex("productOwnership")
    .where("productId", req.body.productId)
    .update(patchParams)
    .returning("id")
    .then((data) => {
      res.send(data);
    });
});

module.exports = router;
