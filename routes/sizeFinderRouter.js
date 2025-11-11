const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.post("/size-finder", (req, res) => {
  const sizeFinderParams = {
    numberOfSteps: req.body.numberOfSteps,
    gender: req.body.gender,
    typeId: req.body.typeId,
  };
  console.log(sizeFinderParams);
  knex("sizeFinder")
    .insert(sizeFinderParams)
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `size finder with id ${id} has been added succesfully `,
      });
      console.log("ladskjfaldskjf;ads");
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

router.patch("/size-finder", (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const sizeFinderParams = {
    numberOfSteps: req.body.numberOfSteps,
    gender: req.body.gender,
    typeId: req.body.typeId,
  };
  knex("sizeFinder")
    .where({ id })
    .update(sizeFinderParams).returning('id')
    .then((sid) => {
      res.send({
        status: 200
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

// get sizeFinder by typeId
router.get("/size-finder", (req, res) => {
  const { typeId } = req.query;
  console.log(typeId);
  if (typeId) {
    knex("sizeFinder")
      .where({ typeId })
      .returning("*")
      .then((data) => {
        res.send({ status: 200, data });
      })
      .catch((r) => {
        console.log(r.message);
        res.send({ status: 500, msg: "caught error check logs" });
      });
  } else {
    res.send({ status: 400, msg: "no arguments" });
  }
});

router.get("/size-finder-id", (req, res) => {
  const { id } = req.query;
  if (id) {
    knex("sizeFinder")
      .where({ id })
      .returning("*")
      .then((data) => {
        res.send({ status: 200, data });
      })
      .catch((r) => {
        console.log(r.message);
        res.send({ status: 500, msg: "caught error check logs" });
      });
  } else {
    res.send({ status: 400, msg: "no arguments" });
  }
});

// delete size finder by type ID
router.delete("/size-finder", (req, res) => {
  const { id } = req.body;
  knex("sizeFinder")
    .where({ id })
    .del()
    .returning("id")
    .then((data) => {
      res.send({
        status: 200,
        msg: `size guide with id ${data} has been deleted`,
      });
    });
});

module.exports = router;
