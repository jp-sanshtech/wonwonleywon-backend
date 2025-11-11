
exports.up = function (knex) {
    return knex.schema.table('products', function (t) {
        t.string('nameOf');
        t.string('proPrice');
        t.string('sizeGuide');
        t.string('material');
        t.string('madeIn');
        t.string('changeCountry');
        t.string('shippingMethod');
        t.string('shippingCost');
        t.string('deliveryTime');
        t.string('paymentMethod');
        t.string('priceAndCurrency');
        t.string('duties');
        t.string('international');
        t.string('returns');
        t.string('contact');
        t.string('philanthropy');
        t.string('care');
    });
};

exports.down = function (knex) {
    return knex.schema.table('products', function (t) {
        t.dropColumn('nameOf');
        t.dropColumn('proPrice');
        t.dropColumn('sizeGuide');
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
        t.dropColumn('contact');
        t.dropColumn('philanthropy');
        t.dropColumn('care');
    });
};
