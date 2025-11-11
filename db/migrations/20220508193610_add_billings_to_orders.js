
exports.up = function (knex) {
    return knex.schema.table('orders', function (t) {
        t.integer('paymentType'); // 1 stripe, 2 paypal
        t.string("email");
        t.string("name");
        t.text("address");
        t.text("address1");
        t.text("address2");
        t.string("unit");
        t.string("city");
        t.string("state");
        t.string("country");
        t.string("postalCode");
        t.string("phone");
        t.boolean("hasBilling");
        t.string("emailBilling");
        t.string("nameBilling");
        t.text("addressBilling");
        t.text("address1Billing");
        t.text("address2Billing");
        t.string("unitBilling");
        t.string("cityBilling");
        t.string("stateBilling");
        t.string("countryBilling");
        t.string("postalCodeBilling");
        t.string("phoneBilling");
        t.string("shippingFee");
    });
};

exports.down = function (knex) {
    return knex.schema.table('orders', function (t) {
        t.dropColumn('paymentType');
        t.dropColumn("email");
        t.dropColumn("name");
        t.dropColumn("address");
        t.dropColumn("address1");
        t.dropColumn("address2");
        t.dropColumn("unit");
        t.dropColumn("city");
        t.dropColumn("state");
        t.dropColumn("country");
        t.dropColumn("postalCode");
        t.dropColumn("phone");
        t.dropColumn("hasBilling");
        t.dropColumn("emailBilling");
        t.dropColumn("nameBilling");
        t.dropColumn("addressBilling");
        t.dropColumn("address1Billing");
        t.dropColumn("address2Billing");
        t.dropColumn("unitBilling");
        t.dropColumn("cityBilling");
        t.dropColumn("stateBilling");
        t.dropColumn("countryBilling");
        t.dropColumn("postalCodeBilling");
        t.dropColumn("phoneBilling");
        t.dropColumn("shippingFee");
    });
};
