const express = require("express");
const { default: mongoose } = require("mongoose");
const auth = require("./routers/auth");
const task = require("./routers/task");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", auth);
app.use("/api/task", task);

mongoose.connect("mongodb://localhost:27017/task-app", () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("app listening on port 3000!");
  });
});
