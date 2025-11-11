const express = require("express");
const knex = require("../db/client");
let fs = require("fs");
const multer = require("multer");
const {s3, uploadS3} = require('../s3Uploader.js');
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();

router.post("/types", (req, res) => {
  const typesParams = {
    name: req.body.name,
    areaAmount: req.body.areaAmount,
    gender: req.body.gender,
    sizeGuide: req.body.sizeGuide,
    femalePrice: req.body.femalePrice,
    malePrice: req.body.malePrice,
    unisexPrice: req.body.unisexPrice,
    nameOf: req.body.nameOf,
    material: req.body.material,
    madeIn: req.body.madeIn,
    changeCountry: req.body.changeCountry,
    shippingMethod: req.body.shippingMethod,
    shippingCost: req.body.shippingCost,
    deliveryTime: req.body.deliveryTime,
    paymentMethod: req.body.paymentMethod,
    priceAndCurrency: req.body.priceAndCurrency,
    duties: req.body.duties,
    international: req.body.international,
    returns: req.body.returns,
    philanthropy: req.body.philanthropy,
    care: req.body.care,
    proImage: req.body.proImage,
    taxes: req.body.taxes,
    proPrice: req.body.proPrice,
    dimensionBefore: req.body.dimensionBefore,
    dimensionDetails: req.body.dimensionDetails,
    label: req.body.label,
    singlecollection: req.body.singlecollection,
    issoldout: req.body.issoldout,
    preSale: req.body.preSale,
    preSaleText: req.body.preSaleText,
    authPortalText: req.body.authPortalText,
  };

  knex("types")
    .insert(typesParams)
    .returning("id")
    .then((data) => {
      res.send(data);
    });
});

router.get("/types", (req, res) => {
  knex("types")
    .select("*")
    .returning("*")
    .orderBy("id", "asc")
    .then((data) => {
      res.send({ list: data });
    });
});

router.get("/typelist", (req, res) => {
  knex("types")
    .columns("id as val", "name as text", "gender as gender")
    // .raw(
    //   `select id as val, name || ' ' || CASE gender WHEN 0 THEN 'female' WHEN 1 THEN 'male' ELSE 'unisex' END  AS text from types`
    // )
    .then((data) => {
      console.log(data);
      res.send({ status: 200, msg: "found it", types: data });
    })
    .catch((r) => {
      res.send({ status: 500, msg: "got error" });
    });
});

router.get("/type-id-gender", (req, res) => {
  const { tid } = req.query;
  if (tid) {
    knex("types")
      .column({ val: "id" }, { text: "name" },{ gender: "gender" })
      .where("id", tid)
      .then((data) => {
        res.send({ status: 200, list: data });
      });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.get("/type", (req, res) => {
  knex("types")
    .select("*")
    .returning("*")
    .where("id", `${req.query.id}`)
    .then((data) => {
      res.send({ type: data[0] });
    });
});


// check if discount code is valid
router.get("/type-discount", (req, res) => {
  const { discountCode, typeId } = req.query;
  
  // Find the specific type with matching id and discount code
  knex("types")
    .where({ id: typeId, discountCode, discount: true })
    .then(type => {
      if (type.length) {
        res.json({
          isCodeValid: true,
          discountAmount: type[0].discountAmount
        });
      } else {
        res.json({
          isCodeValid: false,
          discountAmount: 0
        });
      }
    })
    .catch(err => {
      console.error('Error validating discount:', err);
      res.status(500).json({
        isCodeValid: false,
        discountAmount: 0,
        error: 'Server error validating discount code'
      });
    });
});

// ---------------------------------------------------

router.patch("/types", (req, res) => {
  const patchParams = {
    name: req.body.name,
    areaAmount: req.body.areaAmount,
    gender: req.body.gender,
    sizeGuide: req.body.sizeGuide,
    femalePrice: req.body.femalePrice,
    malePrice: req.body.malePrice,
    unisexPrice: req.body.unisexPrice,
    nameOf: req.body.nameOf,
    material: req.body.material,
    madeIn: req.body.madeIn,
    changeCountry: req.body.changeCountry,
    shippingMethod: req.body.shippingMethod,
    shippingCost: req.body.shippingCost,
    deliveryTime: req.body.deliveryTime,
    paymentMethod: req.body.paymentMethod,
    priceAndCurrency: req.body.priceAndCurrency,
    duties: req.body.duties,
    international: req.body.international,
    returns: req.body.returns,
    philanthropy: req.body.philanthropy,
    care: req.body.care,
    proImage: req.body.proImage,
    taxes: req.body.taxes,
    proPrice: req.body.proPrice,
    dimensionBefore: req.body.dimensionBefore,
    dimensionDetails: req.body.dimensionDetails,
    label: req.body.label,
    singlecollection: req.body.singlecollection,
    issoldout: req.body.issoldout,
    preSale: req.body.preSale,
    preSaleText: req.body.preSaleText,
    discount: req.body.discount,
    discountCode: req.body.discountCode,
    discountAmount: req.body.discountAmount,
    authPortalText: req.body.authPortalText,
  };
  knex("types")
    .where("id", req.body.id)
    .update(patchParams)
    .returning("id")
    .then((data) => {
      res.send(data);
    });
});

const uploadImage = async (req, res, next) => {
  const files = req.files;
  if (files.length === 0) {
    res.status(400).json({ message: "no files" });
    return;
  }

  const image = { menproductimage: [], womenproductimage: [] };
  await Promise.all(
    files.map(async (file) => {
      // file name creation
      const date = new Date();
      const time =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate();
      const name = "s3-" + time + "-" + Math.random() + "-" + file.originalname.trim().replace(/\s/g, "-");
      image[file.fieldname]?.push(name);

      // file upload
      try {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME_IMAGES,
          Key: `collection_images/${name}`, // Make sure the name is the same in s3 and db
          Body: file.buffer,
          ContentType: file.mimetype
        });
        await s3.send(command);
        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    })
  );

  try {
    const images = {};
    if (image.menproductimage.length > 0) {
      images["menproductimage"] = JSON.stringify(image.menproductimage);
    }
    if (image.womenproductimage.length > 0) {
      images["womenproductimage"] = JSON.stringify(image.womenproductimage);
    }
    const id = await knex("types")
      .where("id", req.body.id)
      .update(images)
      .returning("id");
    res.json({ status: 200, msg: "success", id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed" });
  }
};

router.patch("/types/productimage", uploadS3.any(), uploadImage);


router.delete("/types", (req, res) => {
  knex("types")
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

router.get("/has-sizes", (req, res) => {
  const { id } = req.query;
  if (id) {
    knex
      .select("types.menMeaning", "types.womenMeaning")
      .from("sizes")
      .leftJoin("types", "types.id", "sizes.typeId")
      .where("types.id", id)
      .limit(1)
      .then((data) => {
        console.log(data);
        res.send({ status: 200, sizes: data });
      });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.post(
  "/upload-type-video",
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
        const url =
          "video/" + time + "-" + Math.random() + "-" + file.originalname;
        fs.rename("./upload/" + file.filename, "./upload/" + url, (err) => {
          if (err) {
            console.log(err);
            res.send({ status: 500, msg: "can't add" });
            return;
          }
        });
        const { gender } = req.body;
        console.log(req.body);

        switch (gender) {
          case "0":
            knex("types")
              .where({ id: req.body.id })
              .update({
                femaleVideoUrl: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "1":
            knex("types")
              .where({ id: req.body.id })
              .update({
                maleVideoUrl: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "2":
            knex("types")
              .where({ id: req.body.id })
              .update({
                unisexVideoUrl: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "00":
            knex("types")
              .where({ id: req.body.id })
              .update({
                femaleTypeUrl: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "11":
            knex("types")
              .where({ id: req.body.id })
              .update({
                maleTypeUrl: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "22":
            knex("types")
              .where({ id: req.body.id })
              .update({
                unisexTypeUrl: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "111":
            knex("types")
              .where({ id: req.body.id })
              .update({
                menMeaning: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
          case "000":
            knex("types")
              .where({ id: req.body.id })
              .update({
                womenMeaning: url,
              })
              .then()
              .catch((r) => {
                console.log(r);
                res.send({ status: 500, msg: "can't add" });
                return;
              });
            break;
        }
      });
      res.send({ status: 200, msg: "success" });
    }
  }
);

router.post("/upload-type-video-new", (req, res) => {
  const { pId, gender, url } = req.body;
  console.log();
  if (pId) {
    let params = {};
    switch (gender) {
      case "0":
        params = {
          femaleVideoUrl: url,
        };
        break;
      case "1":
        params = {
          maleVideoUrl: url,
        };
        break;
      case "2":
        params = {
          unisexVideoUrl: url,
        };
        break;
      case "00":
        params = {
          femaleTypeUrl: url,
        };
        break;
      case "11":
        params = {
          maleTypeUrl: url,
        };
        break;
      case "22":
        params = {
          unisexTypeUrl: url,
        };
        break;
      case "111":
        params = {
          menMeaning: url,
        };
        break;
      case "000":
        params = {
          womenMeaning: url,
        };
        break;
    }
    knex("types")
      .where({ id: pId })
      .update(params)
      .then((data) => {
        res.send({ status: 200 });
      })
      .catch((r) => {
        console.log(r);
        res.send({ status: 500, msg: "can't add" });
        return;
      });
  }
});

router.get("/get-type-video", (req, res) => {
  const { id, gender } = req.query;
  if (id) {
    switch (gender) {
      case "0":
        knex("types")
          .select("femaleVideoUrl as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "1":
        knex("types")
          .select("maleVideoUrl as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "2":
        knex("types")
          .select("unisexVideoUrl as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "00":
        knex("types")
          .select("femaleTypeUrl as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "11":
        knex("types")
          .select("maleTypeUrl as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "22":
        knex("types")
          .select("unisexTypeUrl as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "111":
        knex("types")
          .select("menMeaning as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
      case "000":
        knex("types")
          .select("womenMeaning as videoUrl")
          .where({ id })
          .then((data) => {
            if (data.length > 0) {
              res.send({ status: 200, video: data[0] });
            } else {
              res.send({ status: 200, video: { id: "0", url: "" } });
            }
          });
        break;
    }
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.get("/get-pro-related-video", (req, res) => {
  const { id, gender } = req.query;
  if (id) {
    knex("types")
      .select("*")
      .where({ id })
      .then((data) => {
        let video = "";
        if (data.length > 0) {
          const {
            femaleVideoUrl,
            maleVideoUrl,
            unisexVideoUrl,
            femaleTypeUrl,
            maleTypeUrl,
            unisexTypeUrl,
          } = data[0];
          if (unisexVideoUrl && (gender == "0" || gender == "1")) {
            // if there's unisex video for product, all gender should use unisexVideoUrl
            video = unisexVideoUrl;
          } else if (unisexTypeUrl && (gender == "00" || gender == "11")) {
            // if there's unisex video for measure, all gender should use unisexTypeUrl
            video = unisexTypeUrl;
          } else {
            switch (gender) {
              case "0":
                video = femaleVideoUrl;
                break;
              case "1":
                video = maleVideoUrl;
                break;
              case "00":
                video = femaleTypeUrl;
                break;
              case "01":
                video = maleTypeUrl;
                break;
            }
          }
        }
        res.send({ status: 200, video });
      });
  } else {
    res.send({ status: 500, msg: "no arguments" });
  }
});

router.delete("/types-video", (req, res) => {
  console.log(req.body);
  const { id, gender } = req.body;
  switch (gender) {
    case "0":
      knex("types")
        .where({ id })
        .update({ femaleVideoUrl: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "1":
      knex("types")
        .where({ id })
        .update({ maleVideoUrl: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "2":
      knex("types")
        .where({ id })
        .update({ unisexVideoUrl: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "00":
      knex("types")
        .where({ id })
        .update({ femaleTypeUrl: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "11":
      knex("types")
        .where({ id })
        .update({ maleTypeUrl: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "22":
      knex("types")
        .where({ id })
        .update({ unisexTypeUrl: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "000":
      knex("types")
        .where({ id })
        .update({ womenMeaning: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
    case "111":
      knex("types")
        .where({ id })
        .update({ menMeaning: "" })
        .returning("*")
        .then((data) => {
          res.send(`${req.body.id} is sucesfully deleted`);
        })
        .catch((r) => {
          res.send(`failed`);
        });
      break;
  }
});

module.exports = router;
