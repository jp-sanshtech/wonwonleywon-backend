const express = require("express");
const knex = require("../db/client");
const router = express.Router();
let fs = require("fs");
const multer = require("multer");

// GET all steps associated with the sizeFinder
// params: productId
router.get("/all-options", (req, res) => {
  const { stepsId } = req.query;
  console.log(req.query);
  knex("options")
    .where({ stepsId })
    .returning("*")
    .orderBy("index", "asc")
    .then((data) => {
      res.send({ status: 200, data });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "error caught check logs" });
    });
});

// GET single step by index and sizeFinderId
// params: index, sizeFinderId
router.get("/option-index", (req, res) => {
  const { stepsId, index } = req.query;
  console.log(req.query);
  knex("options")
    .where({ stepsId, index })
    .returning("*")
    .then((data) => {
      res.send({ status: 200, data });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "error caught check logs" });
    });
});

// GET single option by iid
// params: id
router.get("/option", (req, res) => {
  const { id } = req.query;
  console.log(req.query);
  knex("options")
    .where({ id })
    .returning("*")
    .then((data) => {
      res.send({ status: 200, data });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "error caught check logs" });
    });
});

// POST moments
// params: name, description
router.post("/option", (req, res) => {
  console.log(req.body);
  const optionParams = {
    stepsId: req.body.stepsId,
    content: req.body.content,
    index: req.body.index,
    imageUrl: req.body.imageUrl,
  };
  knex("options")
    .insert(optionParams)
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `option with id ${id} has been added succesfully `,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

router.patch("/option", (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const patchParams = {
    content: req.body.content,
    index: req.body.index,
    imageUrl: req.body.imageUrl,
  };
  knex("options")
    .where({ id })
    .update(patchParams)
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `step with id ${id} has been succesfully updated`,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

router.delete("/option", (req, res) => {
  const { id } = req.body;
  console.log(id);
  knex("options")
    .where({ id })
    .del()
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `option with id ${id} has been succesfully deleted`,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error, check logs" });
    });
});

// Image upload route
router.post(
  "/upload-option-img",
  multer({
    dest: "upload",
  }).array("imgs", 10),
  function (req, res, next) {
    const files = req.files;
    if (files.length === 0) {
      res.render({ status: 400, message: "no files" });
      return;
    } else {
      files.forEach((file) => {
        const date = new Date();
        const time =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();
        const url = time + "-" + Math.random() + "-" + file.originalname;
        fs.rename("./upload/" + file.filename, "./upload/" + url, (err) => {
          if (err) {
            console.log(err);
            res.send({ status: 500, msg: "can't add" });
            return;
          }
        });
        knex("options")
          .where({ id: req.body.id })
          .update({
            imageUrl: url,
          })
          .then()
          .catch((r) => {
            console.log(r.message);
            res.send({ status: 500, msg: "can't add" });
            return;
          });
      });
      res.send({ status: 200, msg: "success" });
    }
  }
);

router.delete("/options-img", (req, res) => {
  console.log(req.body);
  knex("options")
    .where("id", `${req.body.id}`)
    .update({ imageUrl: "" })
    .returning("*")
    .then((data) => {
      if (data[0]) {
        const filePath = data[0].imageUrl;
        try {
          fs.unlinkSync("./upload/" + filePath);
        } catch (error) {
          console.log(error);
        }
      }
      res.send(`${req.body.id} is sucesfully deleted`);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

module.exports = router;
