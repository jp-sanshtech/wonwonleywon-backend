const express = require("express");
const { Resend } = require("resend");
const knex = require("../db/client");
const router = express.Router();
const md5 = require("md5");
// use process.env
const resend = new Resend(process.env.RESEND_API_KEY);

async function getAllProductsAuth(offset, pageSize) {
  const list = await knex
    .select(["email", "pid", "transferDateTime", "productsAuth.id", "name", "productsAuth.password", "cardNumber"])
    .from("productsAuth")
    .leftJoin("products", "products.id", "productsAuth.pid")
    .limit(pageSize)
    .offset(offset)
    .orderBy("productsAuth.id", "desc");
  let amount = await knex("members").count("* as amount");
  amount = amount[0].amount;ddd
  const pageCount = Math.ceil(amount / pageSize);
  return { list, amount, pageCount };
}

router.get("/products-auth", (req, res) => {
  const { pid, offset, pageSize } = req.query;
  //   knex("productsAuth")
  //     .select(["email", "pid", "transferDateTime", "id"])
  //     .where({ pid })
  //     .then((data) => {
  //       res.send({ status: 200, data });
  //     });
  getAllProductsAuth(offset, pageSize)
    .then((result) => {
      res.send(result);
    })
    .catch((r) => {
      console.log(r.message);
      res.send(`failed`);
    });
});

String.prototype.shuffle = function () {
  let a = this.split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
};

const generatePassword = (email) => {
  if (email.length <= 10) {
    return appendRandomNumbers(email).shuffle();
  } else if (email.length > 10) {
    return appendRandomNumbers(cutEmail(email)).shuffle();
  }
};

const generateRandomNumbers = (length) => {
  const randomNumbers = "123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomNumbers.charAt(Math.floor(Math.random() * randomNumbers.length));
  }
  return result.toString();
};

const removeExtraSymbols = (email) => {
  let a = email.split("");
  let result = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== "@" && a[i] !== "." && a[i] !== "-" && a[i] !== "_") {
      result += a[i];
    }
    if (a[i] === "@") {
      break;
    }
  }
  return result;
};

const cutEmail = (email) => {
  let a = email.split("");
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += email[i];
  }
  return result;
};

const appendRandomNumbers = (email) => {
  const length = 16 - email.length;
  return email + generateRandomNumbers(length);
};

router.post("/product-auth", (req, res) => {
  // 🟧 step 1: allow pid only, default email to support@wonwonleywon.com
  if (req.body.pid === undefined) {
    return res.send({ status: 400, msg: "provide pid" });
  }

  // 🟧 step 2: use given email if provided, otherwise fall back to support
  const email = req.body.email && req.body.email.trim() !== ""
    ? req.body.email
    : "support@wonwonleywon.com";

  const today = new Date();
  const params = {
    pid: req.body.pid,
    email,
    password: generatePassword(removeExtraSymbols(email)),
    transferDateTime: today,
  };

  knex("productsAuth")
    .insert(params)
    .returning("*")
    .then((data) => {
      resend.emails.send({
        from: "support@wonwonleywon.com",
        to: "support@wonwonleywon.com",
        subject: "New Product Purchased",
        html: `<p>Customer's email address: <strong>${params.email}</strong></p> </br>
        <p>Product id (purchased): <strong>${params.pid}</strong></p> </br>
        <p>Product Password: <strong>${params.password}</strong></p>`,
      });
      res.send(data);
    });
});

router.post("/transfer-auth", (req, res) => {
  if (!req.body.email || !req.body.pid || !req.body.cardNumber) {
    res.send({ status: 200, msg: "arguments missing" });
    return;
  }
  const { email, pid, pwd, cardNumber } = req.body;
  knex.transaction(async (trx) => {
    try {
      const data = await trx
        .select("productsAuth.password")
        .from("products")
        .innerJoin("productsAuth", "productsAuth.pid", "products.id")
        .orderBy("productsAuth.id", "desc")
        .limit(1)
        .where({
          "products.cardNumber": cardNumber,
          "products.status": 0,
          "products.id": pid,
        });

      if (data.length == 0) {
        throw new Error("No matching product found");
      } else {
        if (pwd === md5(data[0].password)) {
          let today = new Date();
          const params = {
            pid,
            email,
            password: generatePassword(removeExtraSymbols(email)),
            transferDateTime: today,
          };
          await trx("productsAuth").where({ pid: pid, password: data[0].password }).del();
          await trx("productsAuth").insert(params);
          let prodName = await trx("products").select("name").where({id:pid});
          let fullProdName = prodName[0].name;
          await trx.commit();

          resend.emails.send({
            from: "support@wonwonleywon.com",
            to: "support@wonwonleywon.com",
            subject: "New Transfer of product",
            html: `<p>Transferred to: <strong>${params.email}</strong></p></br>
            <p>Card number: <strong>${cardNumber}</strong></p></br>
            <p>Product name: <strong>${fullProdName}</strong></p></br>
            <p>Product id: <strong>${pid}</strong></p></br>
             <p>Password for new owner: <strong>${params.password}</strong></p>`,
          });

          res.send({ status: 200, msg: "transferred" });
        } else {
          throw new Error("Incorrect password");
        }
      }
    } catch (error) {
      // await trx.rollback();
      // console.error("Transaction rolled back due to error:", error);
      res.send({ status: 400, msg: "please try it later" });
    }
  });
});

router.get("/reset-pwd", (req, res) => {
  const { email, cardNumber } = req.query;

  knex("productsAuth")
    .select("email", "cardNumber", "productsAuth.password")
    .leftJoin("products", "products.id", "productsAuth.pid")
    .where({ email, cardNumber })
    .then((data) => {
      if (data.length > 0) {
        const customerEmail = data[0].email;
        const pwd = data[0].password;
        const customerCardNumber = data[0].cardNumber;

        resend.emails.send({
          from: "support@wonwonleywon.com",
          to: "support@wonwonleywon.com",
          subject: "Forgot password request",
          html: `<p>Request from: <strong>${customerEmail}</strong></p> </br>
          <p>Password is: <strong>${pwd}</strong></p> </br>
          <p>Card number is: <strong>${customerCardNumber}</strong></p> </br>`,
        });
        res.send({ status: 200 });
      } else {
        res.send({ status: 401 }); // update-to-production
      }
    });
});

router.get("/is-sold", (req, res) => {
  const { id } = req.query;
  if (id) {
    knex("products")
      .count("id")
      .where({ id, status: 1 })
      .then((data) => {
        if (data[0]?.count === "1") {
          res.json({ status: 200 });
        } else {
          res.json({ status: 404 });
        }
      });
  } else {
    res.json({ status: 401 });
  }
});

module.exports = router;
