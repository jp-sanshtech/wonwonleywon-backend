const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.get("/sizes", (req, res) => {
  knex
    .column("sizes.*", {
      typeName: "types.name",
      //   gender: "types.gender",
    })
    .select()
    .from("sizes")
    .leftJoin("types", "types.id", "sizes.typeId").orderBy('id', "asc")
    .then((data) => {
      res.send({ list: data });
    });
});

router.post("/sizes", (req, res) => {
  console.log(req.body);
  const sizesParams = {
    name: req.body.name,
    typeId: req.body.typeId,
    gender: req.body.gender,
    description: req.body.description,
    menDescription: req.body.menDescription
  };
  knex("sizes")
    .insert(sizesParams)
    .returning("id")
    .then((data) => {
      res.send(data);
    });
});

router.get("/size", (req, res) => {
  knex("sizes")
    .select("*")
    .where("id", `${req.query.id}`)
    .then((data) => {
      res.send({ size: data[0] });
    });
});

router.patch("/sizes", (req, res) => {
  const patchParams = {
    name: req.body.name,
    typeId: req.body.typeId,
    gender: req.body.gender,
    description: req.body.description,
    menDescription: req.body.menDescription
  };
  knex("sizes")
    .where("id", req.body.id)
    .update(patchParams)
    .returning("id")
    .then((data) => {
      res.send(data);
    });
});

router.delete("/sizes", (req, res) => {
  knex("sizes")
    .where("id", req.body.id)
    .del()
    .returning("id")
    .then(() => {
      res.send({ status: 200 });
    })
    .catch((r) => {
      res.send({ status: 500, msg: "error" });
    });
});

router.get("/sizes-by-type", (req, res) => {
  const { tid, gender } = req.query;
  if (tid) {
    const sql = knex("sizes")
      .columns("name as size", "description", "menDescription", 'id as sizeId').orderBy('sizes.id', "asc")
      .where({ typeId: tid });
    if (gender != null) {
      sql.andWhere(function () {
        this.where({ "gender": parseInt(gender) }).orWhere({ "gender": 2 })
      })
    }
    sql.then((data) => {
      res.send({ status: 200, list: data });
    });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.get("/sizelist-by-tid", (req, res) => {
  const { tid } = req.query;
  if (tid) {
    knex("sizes")
      .column({ val: "id" }, { text: "name" })
      .where("typeId", tid)
      .then((data) => {
        res.send({ status: 200, list: data });
      });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

module.exports = router;
