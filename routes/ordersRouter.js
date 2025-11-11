const express = require("express");
const knex = require("../db/client");
const md5 = require("md5");

const router = express.Router();
const tokenAdmin = md5("wonleywon");

async function getAllOrders(offset, pageSize) {
  const list = await knex
    .column("orders.*", {
      productName: "products.name",
      cardNumber: "cardNumber",
    })
    .select()
    .from("orders")
    .leftJoin("products", "products.id", "orders.productId")
    .limit(pageSize)
    .offset(offset)
    .orderBy("id", "desc");
  let amount = await knex("orders").count("* as amount");
  amount = amount[0].amount;
  const pageCount = Math.ceil(amount / pageSize);
  return { list, amount, pageCount };
}

router.get("/orders", (req, res) => {
  const { offset, pageSize } = req.query;
  getAllOrders(offset, pageSize)
    .then((result) => {
      res.send(result);
    })
    .catch((r) => {
      res.send(`failed`);
    });
});

router.get("/orders/:id", (req, res) => {
  if (req.params.id) {
    knex
      .column(
        "orders.*",
        { productName: "products.name" },
        { productPrice: "products.priceUs" },
        "products.size",
        "products.cardNumber",
        "products.gender",
        "products.color",
        "taxes.tax",
        "taxes.duty",
        { typeName: "types.name" }
      )
      .select()
      .from("orders")
      .leftJoin("products", "products.id", "orders.productId")
      .leftJoin("taxes", "taxes.id", "orders.taxId")
      .leftJoin("types", "types.id", "products.typeId")
      .where("orders.id", `${req.params.id}`)
      .then((data) => {
        const order = data[0];
        order.productPriceAfterDiscount = (
          order.productPrice -
          (order.productPrice * order.discountAmount) / 100
        ).toFixed(2);
        res.send(order);
      })
      .catch((r) => {
        console.log(r);
        res.send(`failed`);
      });
  } else {
    res.send(`failed`);
  }
});

// create order for paypal
router.post("/orders", (req, res) => {
  if (req.body.id && req.body.checkoutCode && req.body.amount) {
    const params = {
      productId: req.body.id,
      finalPrice: req.body.amount,
      status: 1,
      checkoutCode: req.body.checkoutCode,
      orderCode: req.body.checkoutCode,
      currency: "usd",
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      address1: req.body.address1,
      address2: req.body.address2,
      country: req.body.country,
      city: req.body.city,
      postalCode: req.body.postalCode,
      state: req.body.state,
      unit: req.body.unit,
      hasBilling: req.body.hasBilling,
      emailBilling: req.body.emailBilling,
      nameBilling: req.body.nameBilling,
      addressBilling: req.body.addressBilling,
      address1Billing: req.body.address1Billing,
      address2Billing: req.body.address2Billing,
      unitBilling: req.body.unitBilling,
      cityBilling: req.body.cityBilling,
      stateBilling: req.body.stateBilling,
      countryBilling: req.body.countryBilling,
      postalCodeBilling: req.body.postalCodeBilling,
      phoneBilling: req.body.phoneBilling,
      shippingFee: req.body.shippingFee,
      paymentType: 2,
      cardName: req.body.cardName,
      discountCode: discountAmount !== 0 ? discountCode : "",
      discountAmount: discountAmount !== 0 ? discountAmount : 0,
    };

    knex("orders")
      .insert(params)
      .returning("id")
      .then((orderData) => {
        if (orderData[0]) {
          res.send({ status: 200, orderId: orderData[0] });
        } else {
          res.send({ status: 401 });
        }
      });
  } else {
    res.send({ status: 401 });
  }
});

router.delete("/orders", (req, res) => {
  const { id, token } = req.body;
  if (id && token == tokenAdmin) {
    knex("orders")
      .where({ id: req.body.id })
      .del()
      .returning("id")
      .then((data) => {
        if (data[0]) {
          res.send({ status: 200 });
        } else {
          res.send({ status: 401 });
        }
      })
      .catch((r) => {
        console.log(r);
        res.send({ status: 401 });
      });
  } else {
    res.send({ status: 401 });
  }
});

router.patch("/orders", async (req, res) => {
  try {
    const { checkoutCode, id } = req.body;
    if (checkoutCode && id) {
      const updateOID = await knex("orders")
        .update({ status: 1 })
        .where({ productId: id, checkoutCode })
        .returning("id");
      const updatePID = await knex("products")
        .update({ status: 0 })
        .where({ id })
        .returning("id");
      if (updateOID[0] && updatePID[0]) {
        res.send({ status: 200 });
      } else {
        res.send({
          status: 401,
        });
      }
    } else {
      res.send({ status: 401 });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: 401 });
  }
});

module.exports = router;
