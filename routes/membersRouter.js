const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.post("/member", (req, res) => {
  const { email } = req.body;
  knex("members")
    .insert({ email })
    .returning("id")
    .then((id) => {
      res.send({ status: 200, msg: `new member created` });
    })
    .catch((r) => {
      res.send({ status: 400, msg: r.message });
    });
});

async function getAllMembers(offset, pageSize) {
  const list = await knex
    .select("*")
    .from("members")
    .limit(pageSize)
    .offset(offset)
    .orderBy("id", "desc");
  let amount = await knex("members").count("* as amount");
  amount = amount[0].amount;
  const pageCount = Math.ceil(amount / pageSize);
  return { list, amount, pageCount };
}

router.get("/members", (req, res) => {
  const { offset, pageSize } = req.query;
  getAllMembers(offset, pageSize)
    .then((result) => {
      res.send(result);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

router.get("/member", (req, res) => {
  const { id } = req.query;
  knex("members")
    .where({ id })
    .returning("*")
    .then((data) => {
      res.send({ status: 200, data });
    })
    .catch((r) => {
      res.send({ status: 400, message: r.message });
    });
});

router.delete("/member", (req, res) => {
  const { id } = req.body;
  knex("members")
    .where({ id })
    .del()
    .returning("id")
    .then((id) => {
      res.send({ status: 200, msg: `member has been deleted succesfully` });
    })
    .catch((r) => {
      res.send({ status: 400, message: r.message });
    });
});

module.exports = router;
