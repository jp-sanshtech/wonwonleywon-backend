const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.post("/answers", (req, res) => {
  const { typeId, email, result } = req.body;
  knex("answers")
    .insert({ typeId, email, result })
    .then((id) => {
      res.send({
        status: 200,
        msg: `answer with id ${id} has been succesfully added`,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

router.get("/answers", (req, res) => {
  knex("answers")
    .columns("types.name", "types.gender", "answers.id", "answers.createdTime")
    .leftJoin("types", "types.id", "answers.typeId")
    .orderBy("id", "desc")
    .then((data) => {
      res.send({ status: 200, data });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

// get by typeId
router.get("/answer-details", (req, res) => {
  const { id } = req.query;
  knex("answers")
    .columns("types.name", "types.gender", "answers.*")
    .leftJoin("types", "types.id", "answers.typeId")
    .where("answers.id", id)
    .then((data) => {
      res.send({ status: 200, answer: data[0] });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

module.exports = router;
