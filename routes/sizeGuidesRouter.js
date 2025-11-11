const express = require("express");
const knex = require("../db/client");
const router = express.Router();
const multer = require("multer");
let fs = require("fs");
// Image upload route
router.post(
  "/upload-sg-img",
  multer({
    dest: "upload",
  }).array("imgs", 1),
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
        knex("sizeGuides")
          .where({ id: req.body.id })
          .update({
            [req.body.type]: url,
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

router.post("/size-guide", (req, res) => {
  const sizeGuideParams = {
    name: req.body.name,
    sizeId: req.body.sizeId,
    index: req.body.index,
    fromInches: req.body.fromInches,
    toInches: req.body.toInches,
    fromCm: req.body.fromCm,
    toCm: req.body.toCm,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    type: req.body.type,
    gender: req.body.gender,
  };
  console.log(sizeGuideParams);
  knex("sizeGuides")
    .insert(sizeGuideParams)
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `size guide with id ${id} has been added succesfully `,
      });
      console.log("ladskjfaldskjf;ads");
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

router.patch("/size-guide", (req, res) => {
  const { id } = req.body;
  const sizeGuideParams = {
    name: req.body.name,
    index: req.body.index,
    fromInches: req.body.fromInches,
    toInches: req.body.toInches,
    fromCm: req.body.fromCm,
    toCm: req.body.toCm,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    type: req.body.type,
    gender: req.body.gender,
  };
  knex("sizeGuides")
    .where({ id })
    .update(sizeGuideParams)
    .then((id) => {
      res.send({
        status: 200,
        msg: `size guide with id ${id} has been updated succesfully `,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

router.get("/size-guides", (req, res) => {
  const { sizeId } = req.query;
  if (sizeId) {
    knex("sizeGuides")
      .where({ sizeId })
      .returning("*")
      .orderBy("index", "asc")
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

router.get("/size-guide", (req, res) => {
  const { id } = req.query;
  if (id) {
    knex("sizeGuides")
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

router.delete("/size-guide", (req, res) => {
  const { id } = req.body;
  knex("sizeGuides")
    .where({ id })
    .del()
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `size guide with id ${id} has been deleted`,
      });
    });
});

router.delete("/sg-img", (req, res) => {
  knex("sizeGuides")
    .where("id", `${req.body.id}`)
    .update({ [req.body.type]: "" })
    .returning("*")
    .then((data) => {
      if (data[0]) {
        const filePath = data[0][req.body];
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

router.get("/size-guides-for-product", (req, res) => {
  const { sizeId, gender } = req.query;
  if (sizeId) {
    knex("sizeGuides")
      .where({ sizeId, gender })
      .returning("*")
      .orderBy("index", "asc")
      .then((data) => {
        res.send({ status: 200, list: data });
      })
      .catch((r) => {
        console.log(r.message);
        res.send({ status: 500, msg: "caught error check logs" });
      });
  } else {
    res.send({ status: 400, msg: "no arguments" });
  }
});

module.exports = router;
