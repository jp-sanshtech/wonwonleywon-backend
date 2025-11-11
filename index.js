const express = require("express");
const session = require("cookie-session");
require("dotenv").config();
const fs = require("fs");

const bodyParser = require("body-parser");
const cors = require("cors");
const productsRouter = require("./routes/productsRouter");
const ordersRouter = require("./routes/ordersRouter");
const uploadRouter = require("./routes/uploadRouter");
// const taxesRouter = require("./routes/taxesRouter");
const typesRouter = require("./routes/typesRouter");
const usersRouter = require("./routes/usersRouter");
const videosRouter = require("./routes/videosRouter");
const adminRouter = require("./routes/adminRouter");
const paymentRouter = require("./routes/paymentRoutes/paymentsRouter");
const pricesRouter = require("./routes/paymentRoutes/pricesRouter");
const sizeRouter = require("./routes/sizeRouter");
const sizeGuides = require("./routes/sizeGuidesRouter");
const sizeFinderRouter = require("./routes/sizeFinderRouter");
const stepsRouter = require("./routes/stepsRouter");
const optionsRouter = require("./routes/optionsRouter");
const answersRouter = require("./routes/answersRouter");
const membersRouter = require("./routes/membersRouter");
const productsAuthRouter = require("./routes/productsAuthRouter");
const shippingsRouter = require("./routes/shippingsRouter");

const app = express();
const https = require("https");
const http = require("http").createServer(app);

// var options = {
//   key: fs.readFileSync('./keys/privatekey-nopass.pem', 'utf8'),
//   cert: fs.readFileSync('./keys/wonwonleywon.crt', 'utf8')
// }
// var httpsServer = https.createServer(options, app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://wonwonleywon.com", "https://www.wonwonleywon.com", "http://localhost:3000" , 'https://wonwonleywon-backend.onrender.com'],
    credentials: true,
  })
);

app.use(
  session({
    secret: "wonwonleywon",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 3,
    },
  })
);

app.use(productsRouter);
app.use(ordersRouter);
app.use(uploadRouter);
// app.use(taxesRouter);
app.use(typesRouter);
app.use(usersRouter);
app.use(videosRouter);
app.use(adminRouter);
app.use(paymentRouter);
app.use(pricesRouter);
app.use(sizeRouter);
app.use(sizeGuides);
app.use(sizeFinderRouter);
app.use(stepsRouter);
app.use(optionsRouter);
app.use(answersRouter);
app.use(membersRouter);
app.use(productsAuthRouter);
app.use(shippingsRouter);
app.use(express.static("upload"));

const knex = require("./db/client");
const migrate = async () => {
  try {
    await knex.schema.alterTable("types", (tableBuilder) => tableBuilder.boolean("issoldout"));
  } catch (error) {
    //  console.log(error);
    
  }
};
migrate();
const PORT = 4000;
http.listen(PORT, () => {
  console.log(`HTTP server is running on port ${PORT}`);
});

// httpsServer.listen(4001, () => {
//   console.log(`HTTPS server is running on port 4001`);
// });
