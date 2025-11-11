const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.get("/shipping-price-one", (req, res) => {
    const shippingsParams = {
        typeId: req.query.typeId,
        countryId: req.query.countryId,
    }
    knex.select()
        .from("shippings")
        .where(shippingsParams)
        .then((data) => {
            res.send(data[0]);
        });
});

router.post("/shippings", (req, res) => {
    const shippingsParams = {
        price: req.body.price,
        typeId: req.body.typeId,
        countryId: req.body.countryId,
    };
    knex("shippings")
        .insert(shippingsParams)
        .returning("id")
        .then((data) => {
            res.send(data);
        });
});

router.post("/add-shipping-all", async (req, res) => {
    const { price, typeId } = req.body;
    if (price && typeId) {
        const countryIds = await knex("countries").column('id');
        const insertArr = [];
        countryIds.forEach(({ id }) => {
            insertArr.push({ price, typeId, countryId: parseInt(id) })
        });
        knex("shippings")
            .insert(insertArr)
            .then((data) => {
                if (data.rowCount) {
                    res.send({ status: 200 });
                } else {
                    res.send({ status: 404 });
                }
            });
    } else {
        res.send({ status: 404 });
    }

});

router.patch("/shippings", (req, res) => {
    const patchParams = {
        price: req.body.price,
    };
    knex("shippings")
        .where({ typeId: req.body.typeId, countryId: req.body.countryId })
        .update(patchParams)
        .returning("id")
        .then((data) => {
            if (data[0]) {
                res.send({ status: 200 });
            } else {
                res.send({ status: 404 });
            }
        });
});

// router.get("/shipping-price-with-", (req, res) => {
//     const shippingsParams = {
//         typeId: req.body.typeId,
//         countryId: req.body.countryId,
//     }
//     knex.column("price")
//         .from("shippings")
//         .where(shippingsParams)
//         .then((data) => {
//             res.send({ price: data[0] });
//         });
// });

module.exports = router;