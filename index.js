const express = require("express");
const { default: mongoose } = require("mongoose");
const auth = require("./routers/auth");
const task = require("./routers/task");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", auth);
app.use("/api/task", task);

const port = process.env.PORT || 3000;
mongoose.connect(process.env.pro_db_connect, () => {
  app.listen(() => {
    console.log("app listening on port " + port);
  });
});

// task-app-user
// coRL0fXedw3pVSG0
