const express = require("express");
const req = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

const auth = express.Router();

const Users = mongoose.model(
  "user",
  new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })
);

auth.post("/register", async (req, res) => {
  if (req.body.userName === "")
    return res.send({ ok: false, error: "username not provided" });
  if (req.body.email === "")
    return res.send({ ok: false, error: "email not provided" });
  if (req.body.password === "")
    return res.send({ ok: false, error: "password not provided" });
  try {
    const data = await Users({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    }).save();

    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

auth.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (email === "") return res.send({ ok: false, error: "email not provided" });
  if (password === "")
    return res.send({ ok: false, error: "password not provided" });
  try {
    const user = await Users.findOne({ email: email, password: password });
    if (!user) return res.send({ ok: false, error: "invalid email/password " });

    const token = jwt.sign(
      {
        ok: true,
        uName: user.userName,
        id: user.id,
      },
      "taskToken"
    );

    res.send({ ok: true, token: token });
  } catch (error) {
    res.send({ ok: false, error: error + "na mongodb oo" });
  }
});

module.exports = auth;
//Run app, then load http://localhost:port in a browser to see the output.
