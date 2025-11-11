const express = require("express");
const knex = require("../db/client");
const router = express.Router();

let fs = require("fs");
const multer = require("multer");

router.post(
  "/upload-step-img",
  multer({
    dest: "upload",
  }).array("imgs", 10),
  function (req, res, next) {
    console.log(req.body, "77777777");
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
        knex("steps")
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
router.post(
  "/upload-step-video",
  multer({
    dest: "upload",
  }).array("video", 10),
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
        console.log();
        knex("steps")
          .where({ id: req.body.id })
          .update({
            videoUrl: url,
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

// GET all steps associated with the sizeFinder
router.get("/all-steps", (req, res) => {
  const { sizeFinderId } = req.query;
  console.log(req.query);
  knex("steps")
    .where({ sizeFinderId })
    .returning("*")
    .orderBy("index")
    .then((data) => {
      res.send({ status: 200, data });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "error caught check logs" });
    });
});
// GET single step by id
// params: id
router.get("/step", (req, res) => {
  const { id } = req.query;
  console.log(req.query);
  knex("steps")
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

// GET single step by index and sizeFinderId
// params: index, sizeFinderId
router.get("/step-index", (req, res) => {
  const { sizeFinderId, index } = req.query;
  console.log(req.query);
  knex("steps")
    .where({ sizeFinderId, index })
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
// TYPES: 1 - single choice, 2 - input a value, 3 - three options,
// 4 - email box, 5 insert inch or cm, 6 - multiple options
router.post("/step", (req, res) => {
  console.log(req.body);
  const stepParams = {
    sizeFinderId: req.body.sizeFinderId,
    type: req.body.type,
    description: req.body.description,
    index: req.body.index,
    imageUrl: req.body.imageUrl,
    shortName: req.body.shortName,
    videoUrl: req.body.videoUrl,
  };
  knex("steps")
    .insert(stepParams)
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `step with id ${id} has been added succesfully `,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error check logs" });
    });
});

// TYPES: 1 - single choice, 2 - input a value, 3 - three options,
// 4 - email box, 5 insert inch or cm, 6 - multiple options

router.patch("/step", (req, res) => {
  const { id } = req.body;
  const patchParams = {
    type: req.body.type,
    description: req.body.description,
    index: req.body.index,
    imageUrl: req.body.imageUrl,
    shortName: req.body.shortName,
    videoUrl: req.body.videoUrl,
  };
  knex("steps")
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

router.delete("/step", (req, res) => {
  const { id } = req.body;
  console.log(id);
  knex("steps")
    .where({ id })
    .del()
    .returning("id")
    .then((id) => {
      res.send({
        status: 200,
        msg: `step with id ${id} has been succesfully deleted`,
      });
    })
    .catch((r) => {
      console.log(r.message);
      res.send({ status: 500, msg: "caught error, check logs" });
    });
});

router.get("/all-steps-by-tid", (req, res) => {
  const { tid, gender } = req.query;
  knex("sizeFinder").select("*").where({ "typeId": tid }).then(finders => {
    if (finders.length) {
      let temp = false;
      finders.map(e => {
        if (e.gender == 2) {
          temp = true;
        }
      });
      const sql = knex("sizeFinder").columns(
        "steps.*",
        "options.id as oid",
        "options.content",
        "options.index as oIndex",
        "options.imageUrl as oUrl"
      )
        .leftJoin("steps", "sizeFinder.id", "steps.sizeFinderId")
        .leftJoin("options", "steps.id", "options.stepsId")
        .orderBy([{ column: "steps.index" }, { column: "options.index" }])
        .where({ "sizeFinder.typeId": tid });
      if (temp) {
        sql.andWhere({ "sizeFinder.gender": 2 })
      } else {
        sql.andWhere({ "sizeFinder.gender": gender })
      }
      sql.then((data) => {
        const arr = groupStepList(data);
        res.send({ status: 200, list: arr });
      }).catch((r) => {
        console.log(r.message);
        res.send({ status: 500, msg: "error caught check logs" });
      });
    }

  }).catch((r) => {
    console.log(r.message);
    res.send({ status: 500, msg: "error caught check logs" });
  });

});

function groupStepList(arr = []) {
  const map = {};
  const result = [];
  let i = 0;
  arr.map((e, index) => {
    if (map[e.id] === undefined) {
      map[e.id] = i;
      i++;
      const temp = {
        type: e.type,
        imgUrl: e.imageUrl,
        videoUrl: e.videoUrl,
        shortName: e.shortName,
        sIndex: e.index,
        description: e.description,
        stepId: e.id
      };
      if (e.oid) {
        temp.options = [
          {
            id: e.oid,
            text: e.content,
            index: e.oIndex,
            imageUrl: e.oUrl,
          },
        ];
      } else {
        temp.options = [];
      }
      result.push(temp);
    } else {
      const temp = result[map[e.id]];
      temp.options.push({
        id: e.oid,
        text: e.content,
        index: e.oIndex,
        imageUrl: e.oUrl,
      });
    }
  });
  return result;
}
module.exports = router;
