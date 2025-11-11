exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("taxes")
    .del()
    .then(function () {
      // we are using static tax for the front end now, 
      // if you change this tax %, also change it for the front end
      return knex("taxes").insert([
        { id: 1, area: "Alberta", shippingCost: "40", tax: "5", duty: "" },
        {
          id: 2,
          area: "British Columbia",
          shippingCost: "40",
          tax: "12",
          duty: "",
        },
        { id: 3, area: "Manitoba", shippingCost: "40", tax: "12", duty: "" },
        {
          id: 4,
          area: "New Brunswick",
          shippingCost: "40",
          tax: "15",
          duty: "",
        },
        {
          id: 5,
          area: "Newfoundland and Labrador",
          shippingCost: "40",
          tax: "15",
          duty: "",
        },
        {
          id: 6,
          area: "Northwest Territories",
          shippingCost: "40",
          tax: "5",
          duty: "",
        },
        { id: 7, area: "Nova Scotia", shippingCost: "40", tax: "15", duty: "" },
        { id: 8, area: "Nunavut", shippingCost: "40", tax: "5", duty: "" },
        { id: 9, area: "Ontario", shippingCost: "40", tax: "13", duty: "" },
        {
          id: 10,
          area: "Prince Edward Island",
          shippingCost: "40",
          tax: "15",
          duty: "",
        },
        { id: 11, area: "Quebec", shippingCost: "40", tax: "15", duty: "" },
        {
          id: 12,
          area: "Saskatchewan",
          shippingCost: "40",
          tax: "11",
          duty: "",
        },
        { id: 13, area: "Yukon", shippingCost: "40", tax: "5", duty: "" },
        { id: 14, area: "USA", shippingCost: "60", tax: "5", duty: "" },
        { id: 15, area: "Other", shippingCost: "100", tax: "5", duty: "" },
      ]);
    });
};
