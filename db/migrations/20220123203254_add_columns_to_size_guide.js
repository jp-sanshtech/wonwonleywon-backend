exports.up = function (knex) {
    return knex.schema.table("sizeGuides", (t) => {
        t.string("largeImgUrl");
    });
};

exports.down = function (knex) {
    return knex.schema.table("sizeGuides", (t) => {
        t.dropColumn("largeImgUrl");
    });
};
