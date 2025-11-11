const express = require("express");
const knex = require("../db/client");
const router = express.Router();
const multer = require("multer");
let fs = require("fs");
const md5 = require("md5");

router.post("/products", (req, res) => {
  const typesParams = {
    name: req.body.name,
    priceCanada: req.body.priceCanada,
    priceUs: req.body.priceUs,
    size: req.body.productSize,
    cardNumber: req.body.cardNumber,
    password: req.body.password,
    status: parseInt(req.body.status),
    typeId: parseInt(req.body.typeId),
    gender: parseInt(req.body.gender),
    color: req.body.color,
    sizeId: req.body.sizeId,
    removeShipmentCharge:req.body.removeShipmentCharge,
    singleproduct:req.body.singleproduct
  };
  knex("products")
    .insert(typesParams)
    .returning("id")
    .then(() => {
      res.send({ status: 200, msg: `success` });
    })
    .catch((r) => {
      console.log(r);
      res.send({ status: 500, msg: `failed` });
    });
});

async function getAllProducts(offset, pageSize, searchInfo = '') {
  const list = await knex
    .column("products.*", {
      typeName: "types.name",
    })
    .select()
    .from("products")
    .leftJoin("types", "types.id", "products.typeId")
    .limit(pageSize)
    .andWhere(function () {
      if (searchInfo) {
        this.where("products.cardNumber", 'ilike', `%${searchInfo}%`).orWhere("products.name", 'ilike', `%${searchInfo}%`);
      }
    })
    .offset(offset)
    .orderBy("id", "desc");
  let amount = await knex("products").count("* as amount");
  amount = amount[0].amount;
  const pageCount = Math.ceil(amount / pageSize);
  return { list, amount, pageCount };
}

router.get("/products", (req, res) => {
  const { offset, pageSize, searchInfo } = req.query;
  getAllProducts(offset, pageSize, searchInfo)
    .then((result) => {
      res.send(result);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

router.patch("/products", (req, res) => {
  const patchParams = {
    name: req.body.name,
    priceUs: req.body.priceUs,
    priceCanada: req.body.priceCanada,
    size: req.body.productSize,
    cardNumber: req.body.cardNumber,
    password: req.body.password,
    status: parseInt(req.body.status),
    typeId: parseInt(req.body.typeId),
    gender: parseInt(req.body.gender),
    color: req.body.color,
    // nameOf: req.body.nameOf,
    // proPrice: req.body.proPrice,
    // sizeGuide: req.body.sizeGuide,
    // material: req.body.material,
    // madeIn: req.body.madeIn,
    // changeCountry: req.body.changeCountry,
    // shippingMethod: req.body.shippingMethod,
    // shippingCost: req.body.shippingCost,
    // deliveryTime: req.body.deliveryTime,
    // paymentMethod: req.body.paymentMethod,
    // priceAndCurrency: req.body.priceAndCurrency,
    // duties: req.body.duties,
    // international: req.body.international,
    // tracking: req.body.tracking,
    // returns: req.body.returns,
    // refund: req.body.refund,
    // contact: req.body.contact,
    // philanthropy: req.body.philanthropy,
    // care: req.body.care,
    // proImage: req.body.proImage,
    sizeId: req.body.sizeId,
    removeShipmentCharge:req.body.removeShipmentCharge,
    singleproduct:req.body.singleproduct
  };
  knex("products")
    .where({ id: parseInt(req.body.productId) })
    .update(patchParams)
    .returning("id")
    .then((data) => {
      res.send(data);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

router.delete("/products", (req, res) => {
  knex("products")
    .where("id", `${req.body.id}`)
    .del()
    .returning("id")
    .then(() => {
      res.send(`${req.body.id} is sucesfully deleted`);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

router.get("/products/:id", (req, res) => {
  knex
    .column("products.*", {
      typeName: "types.name",
    })
    .select()
    .from("products")
    .leftJoin("types", "types.id", "products.typeId")
    .where("products.id", `${req.params.id}`)
    .then((data) => {
      res.send(data);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

/// Authentication Card Number
router.get("/authenticationcard", (req, res) => {
  const { cardNumber, password } = req.query;
  if (cardNumber && cardNumber.length == 16 && password) {
    knex
      .select("productsAuth.pid", "productsAuth.password", "productsAuth.email", "types.authPortalText")
      .from("products")
      .leftJoin("productsAuth", "products.id", "productsAuth.pid")
      .leftJoin("types", "types.id", "products.typeId")
      .orderBy("productsAuth.id", "desc")
      .limit(1)
      .where({ "products.cardNumber": cardNumber, "products.status": 0 })
      .then((data) => {
        if (data.length == 0) {
          res.send({
            status: 400,
            msg: "please check the card number or password",
          });
        } else {
          if (password === md5(data[0].password)) {
            res.send({
              status: 200,
              msg: "found it",
              id: data[0].pid,
              email: data[0].email,
              authPortalText: data[0].authPortalText
            });
          } else {
            res.send({
              status: 400,
              msg: "please check the card number or password",
            });
          }
        }
      })
      .catch((r) => {
        res.send(`failed`);
      });
  } else {
    res.send({ status: 400, msg: "please check the card number or password!" });
  }
});
/// end

router.get("/getTypeByGender", (req, res) => {
  const gender = req.query.gender;
  if (gender != "") {
    knex("types").select("*")
      .andWhere(function () {
        this.where({ gender: gender }).orWhere({ gender: 2 });
      }).orderBy('id', "asc")
      .then((data) => {
        if (data.length != 0) {
          res.send({ status: 200, msg: "succeed", types: data });
        } else {
          res.send({ status: 200, msg: "no data", types: [] });
        }
      });
  } else {
    res.send({ status: 400, msg: "wrong gender" });
  }
});

router.get("/getProductIdByColor", (req, res) => {
  const { color, typeId, gender, size } = req.query;
  if (color && typeId && gender) {
    const sql = knex
      .select("*")
      .from("products")
      .where({ typeId, status: 1, color })
      .andWhere(function () {
        this.where({ gender: gender }).orWhere({ gender: 2 });
      });
    if (size && size != "undefined" && size != "null") {
      sql.andWhere("size", size);
    }
    sql
      .then((data) => {
        if (data.length == 0) {
          res.send({ status: 400, msg: "Sorry, no this color combination" });
        } else {
          res.send({ status: 200, msg: "found it", id: data[0].id });
        }
      })
      .catch((r) => {
        res.send({ status: 500, msg: "got error" });
      });
  } else {
    res.send({ status: 400, msg: "params error" });
  }
});

router.get("/getNextColor", (req, res) => {
  const { colorComb, index, typeId, gender, size } = req.query;
  if (index && typeId && gender) {
    if (index == 0) {
      const sql = knex
        .distinct(`color[1]`)
        .from("products")
        .where({ typeId, status: 1 })
        .andWhere(function () {
          this.where({ gender: gender }).orWhere({ gender: 2 });
        });
      if (size) {
        sql.andWhere("size", size);
      }
      sql
        .then((data) => {
          if (data.length == 0) {
            res.send({ status: 400, msg: "Sorry, no next color" });
          } else {
            res.send({ status: 200, msg: "found it", colors: data });
          }
        })
        .catch((r) => {
          res.send({ status: 500, msg: "got error" });
        });
    } else {
      let sql = knex
        .distinct(`color[${parseInt(index) + 1}]`)
        .from("products")
        .where({ typeId, status: 1 })
        .andWhere(function () {
          this.where({ gender: gender }).orWhere({ gender: 2 });
        });
      colorComb.split(",").map((e, i) => {
        sql.andWhere(`color[${i + 1}]`, e);
      });
      if (size) {
        sql.andWhere("size", size);
      }
      sql
        .then((data) => {
          if (data.length == 0) {
            res.send({ status: 400, msg: "Sorry, no next color" });
          } else {
            res.send({ status: 200, msg: "found it", colors: data });
          }
        })
        .catch((r) => {
          res.send({ status: 500, msg: "got error" });
        });
    }
  } else {
    res.send({ status: 400, msg: "params error" });
  }
});

router.get("/get-product-info", (req, res) => {
  const column = req.query.title;
  const id = req.query.tid;
  if (column && id) {
    knex
      .select(column)
      .from("types")
      .where({ id })
      .then((data) => {
        if (data.length == 0) {
          res.send({ status: 400, msg: "no result" });
        } else {
          res.send({ status: 200, msg: "found it", content: data[0][column] });
        }
      })
      .catch((r) => {
        res.send({ status: 400, msg: "error" });
      });
  } else {
    res.send({ status: 400, msg: "no arguments" });
  }
});

router.post(
  "/upload-pro-imgs",
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
        knex("products")
          .where({ id: req.body.productId })
          .update({ proImage: url })
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

router.get("/product-image", (req, res) => {
  const { id } = req.query;
  if (id) {
    knex("products")
      .where({ id })
      .returning("proImage")
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

router.delete("/product-img", (req, res) => {
  console.log(req.body);
  knex("products")
    .where("id", `${req.body.id}`)
    .update({ proImage: "" })
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

router.get("/get-product-details-info", (req, res) => {
  const column = req.query.title;
  const id = req.query.tid;
  if (column && id) {
    knex
      .select(column)
      .from("products")
      .where({ id })
      .then((data) => {
        if (data.length == 0) {
          res.send({ status: 400, msg: "no result" });
        } else {
          res.send({ status: 200, msg: "found it", content: data[0][column] });
        }
      })
      .catch((r) => {
        res.send({ status: 400, msg: "error" });
      });
  } else {
    res.send({ status: 400, msg: "no arguments" });
  }
});

router.get("/has-single-product", (req, res) => {
  const typeId = req.query.id;
  if (typeId) {
    knex
      .select("*")
      .from("products")
      .where({ typeId:typeId,singleproduct:true })
      .then((data) => {
        if (data.length == 0) {
          res.send({ status: 400, msg: "no result" });
        } else {
          res.send({ status: 200, msg: "found it", products: data });
        }
      })
      .catch((r) => {
        res.send({ status: 400, msg: "error" });
      });
  } else {
    res.send({ status: 400, msg: "no arguments" });
  }
});


module.exports = router;
