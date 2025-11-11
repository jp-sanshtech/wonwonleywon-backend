const express = require("express");
const router = express.Router();
const knex = require("../db/client");
let fs = require("fs");
const multer = require("multer");
const { uploadS3, s3 } = require("../s3Uploader");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// migrate to s3

// add uploadS3 function here
// const uploadS3 = multer({storage: multer.memoryStorage()})
const uploadImage = async (req, res, next) => {
  const files = req.files;
  if (files.length === 0) {
    res.render({ status: 400, message: "no files" });
    return;
  }

  // uploading to s3
  let fileName;
  await Promise.all(
    files.map(async (file) => {
      // file name creation
      const date = new Date();
      const time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      fileName = "s3-" + time + "-" + Math.random() + "-" + file.originalname.trim().replace(/\s/g, "-");

      // file upload
      try {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME_IMAGES,
          Key: `product_images/${fileName}`, // Make sure the name is the same in s3 and db
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        await s3.send(command);
        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    })
  );

  // storing data in database
  knex("pictures")
    .insert({ productId: req.body.id, url: fileName, type: req.body.type, index: req.body.index })
    .then()
    .catch((r) => {
      console.log(r);
      res.send({ status: 500, msg: "can't add" });
      return;
    });
  res.send({ status: 200, msg: "success" });
};

router.post("/uploadimgs", uploadS3.any(), uploadImage);

// migrate end

router.get("/get-imgs-by-pid", (req, res) => {
  const { id, type, gender, usrType } = req.query;
  if (id) {
    const sql = knex("pictures").select("*").where({ productId: id });
    // male product page
    if (gender == 1 && usrType === "usr") {
      sql.andWhere(function () {
        this.where({ type: 1 }).orWhere({ type: 4 });
      });
    }
    // female product page
    else if (gender != 1 && usrType === "usr") {
      sql.andWhere(function () {
        this.where({ type: 1 }).orWhere({ type: 5 });
      });
    }
    // authenticity page
    else if (type == 2) {
      sql.andWhere(function () {
        this.where({ type: 2 });
      });
    }
    // all images of an product on admin/view_details page
    else if (type == 6) {
      sql.andWhere(function () {
        this.where({ type: 1 }).orWhere({ type: 2 }).orWhere({ type: 4 }).orWhere({ type: 5 });
      });
    }
    // rest all images in website
    else {
      sql.andWhere("type", type);
    }
    sql
      .orderBy([
        { column: "type", order: "desc" },
        { column: "index", order: "desc" },
      ])
      .then((data) => {
        res.send({ status: 200, imgs: data });
      });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.delete("/pictures", (req, res) => {
  knex("pictures")
    .where("id", `${req.body.id}`)
    .del()
    .returning("*")
    .then(async(data) => {
      if (data[0]) {
        const filePath = data[0].url;

        // delete from s3
        if(data[0].url.startsWith("s3")) {
          try {
            const command = new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME_IMAGES,
              Key: `product_images/${data[0].url}`, // Make sure the name is the same in s3 and db
              
            });
            await s3.send(command);
            console.log("Image deleted successfully");
          } catch (error) {
            console.error("Error deleting image:", error);
          }

        }else{
          // delete from local
          try {
            fs.unlinkSync("./upload/" + filePath);
          } catch (error) {
            console.log(error);
          }
        }
      }
      res.send(`${req.body.id} is sucesfully deleted`);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

router.post(
  "/upload-video",
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
        const time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const url = "video/" + time + "-" + Math.random() + "-" + file.originalname;
        fs.rename("./upload/" + file.filename, "./upload/" + url, (err) => {
          if (err) {
            console.log(err);
            res.send({ status: 500, msg: "can't add" });
            return;
          }
        });
        knex("videos")
          .insert({ pid: req.body.productId, url: url, type: 1 })
          .then()
          .catch((r) => {
            console.log(r);
            res.send({ status: 500, msg: "can't add" });
            return;
          });
      });
      res.send({ status: 200, msg: "success" });
    }
  }
);

router.get("/get-video-by-pid", (req, res) => {
  const { id } = req.query;
  if (id) {
    knex("videos")
      .select("*")
      .returning("*")
      .where({ pid: id })
      .then((data) => {
        if (data.length > 0) {
          res.send({ status: 200, video: data[0] });
        } else {
          res.send({ status: 200, video: { id: "0", url: "" } });
        }
      });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.delete("/videos", (req, res) => {
  knex("videos")
    .where("id", `${req.body.id}`)
    .del()
    .returning("*")
    .then((data) => {
      if (data[0]) {
        const filePath = data[0].url;
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
