const { request } = require("express");
const express = require("express");
const router = express.Router();
const knex = require("../../db/client");

const stripe = require("stripe")(process.env.STRIPE);

// create payment intent and order with stripe
router.get("/secret", async (req, res) => {
  const { id, countryId, discountCode, discountAmount } = req.query;
  if (id && countryId) {
    try {
      const priceData = await knex("products")
        .columns("priceUs", "status", "shippings.price")
        .leftJoin("shippings", "shippings.typeId", "products.typeId")
        .where({
          "products.id": req.query.id,
          "shippings.countryId": countryId,
        }).orderBy("shippings.id", "desc");
      let area = "";
      let basicPrice = parseFloat(priceData[0].priceUs);
      const shippingFee = parseFloat(priceData[0].price);
      if (priceData[0].status === 0) {
        res.send({
          status: 406,
          msg: "product already sold out",
          client_secret: null,
        });
        return;
      } else {
        if (req.query.country === "Canada") {
          area = req.query.state;
        } else if (req.query.country === "United States") {
          area = "USA";
        } else {
          area = "Other";
        }
        const taxData = await knex("taxes")
          .columns("tax", "id")
          .where({ area });
        if (basicPrice) {
          let amount = (
            basicPrice +
            (parseInt(taxData[0].tax) * basicPrice) / 100 +
            parseFloat(priceData[0].price)
          ).toFixed(2);

          if (discountAmount !== 0) {
            amount = (amount - (amount * discountAmount) / 100).toFixed(2);
          }

          const paymentIntent = await stripe.paymentIntents.create({
            amount: parseFloat(amount) * 100,
            currency: "usd",
            payment_method_types: ["card"],
            description: id,
          });
          if (paymentIntent?.client_secret) {
            const params = {
              productId: req.query.id,
              finalPrice: amount,
              taxId: taxData[0].id,
              status: 0,
              checkoutCode: paymentIntent.id,
              orderCode: paymentIntent.id,
              currency: "usd",
              name: req.query.name,
              phone: req.query.phone,
              email: req.query.email,
              address: req.query.address,
              address1: req.query.address1,
              address2: req.query.address2,
              country: req.query.country,
              city: req.query.city,
              postalCode: req.query.postalCode,
              state: req.query.state,
              unit: req.query.unit,
              hasBilling: req.query.hasBilling,
              emailBilling: req.query.emailBilling,
              nameBilling: req.query.nameBilling,
              addressBilling: req.query.addressBilling,
              address1Billing: req.query.address1Billing,
              address2Billing: req.query.address2Billing,
              unitBilling: req.query.unitBilling,
              cityBilling: req.query.cityBilling,
              stateBilling: req.query.stateBilling,
              countryBilling: req.query.countryBilling,
              postalCodeBilling: req.query.postalCodeBilling,
              phoneBilling: req.query.phoneBilling,
              shippingFee,
              paymentType: 1,
              cardName: req.query.cardName,
              discountCode: discountAmount !== 0 ? discountCode : "",
              discountAmount: discountAmount !== 0 ? discountAmount : 0,
            };
            const addOrder = await knex("orders")
              .insert(params)
              .returning("id");
            if (addOrder[0]) {
              res.json({
                status: 200,
                client_secret: paymentIntent.client_secret,
                checkoutCode: params.checkoutCode,
                amount,
              });
            } else {
              res.json({ status: 404, client_secret: null });
            }
          } else {
            res.json({ status: 404, client_secret: null });
          }
        } else {
          res.json({ status: 404, client_secret: null });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ status: 503, client_secret: null });
    }
  } else {
    res.json({ status: 503, client_secret: null });
  }
});

router.get("/paypal", async (req, res) => {
  res.send();
});

router.post("/create-order", async (req, res) => {});

module.exports = router;
