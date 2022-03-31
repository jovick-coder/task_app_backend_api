const cors = require("cors");
const express = require("express");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const auth = require("./routers/auth");
const task = require("./routers/task");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", auth);
app.use("/api/task", task);

const port = process.env.PORT || 3000;
mongoose.connect(process.env.dev_db_connect, () => {
  app.listen(port, () => {
    console.log("app listening on port " + port);
  });
});

// task-app-user
// coRL0fXedw3pVSG0
