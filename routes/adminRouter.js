const express = require("express");
const md5 = require("md5");
const router = express.Router();

const tempUser = md5("wonwonleywon");
const tempPass = md5("won222ley@111");

router.post("/admin", (req, res) => {
  if (req.body.user === tempUser && req.body.pass === tempPass) {
    req.session.userName = tempUser;
    res.send({ status: "success", userName: tempUser });
  } else {
    res.send({ status: "denied" });
  }
});

router.get("/userInfo", function (req, res) {
  if (req.session.userName) {
    res.send({ status: "success" });
  } else {
    res.send({ status: "reLogin" });
  }
});

router.get("/products", (req, res) => {
  res.send("access granted");
});

module.exports = router;
