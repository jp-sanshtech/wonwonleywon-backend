exports.up = function (knex) {
    return knex.schema.table('types', function (t) {
        t.text('nameOf');
        t.text('material');
        t.text('madeIn');
        t.text('changeCountry');
        t.text('shippingMethod');
        t.text('shippingCost');
        t.text('deliveryTime');
        t.text('paymentMethod');
        t.text('priceAndCurrency');
        t.text('duties');
        t.text('international');
        t.text('returns');
        t.text('philanthropy');
        t.text('care');
        t.text('taxes');
        t.text("proImage");
    });
};

exports.down = function (knex) {
    return knex.schema.table('types', function (t) {
        t.dropColumn('nameOf');
        t.dropColumn('material');
        t.dropColumn('madeIn');
        t.dropColumn('changeCountry');
        t.dropColumn('shippingMethod');
        t.dropColumn('shippingCost');
        t.dropColumn('deliveryTime');
        t.dropColumn('paymentMethod');
        t.dropColumn('priceAndCurrency');
        t.dropColumn('duties');
        t.dropColumn('international');
        t.dropColumn('returns');
        t.dropColumn('philanthropy');
        t.dropColumn('care');
        t.dropColumn('taxes');
        t.dropColumn('proImage');
    });
};
