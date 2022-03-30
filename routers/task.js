const express = require("express");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

const task = express.Router();

const Tasks = mongoose.model(
  "task",
  new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    uId: { type: String, required: true },
    done: { type: Boolean, required: true },
    date: { type: Date, default: Date.now },
    endDate: { type: Date },
    reminder: { type: Boolean, required: true },
  })
);
function auth(req, res, next) {
  try {
    const responseToken = req.headers.authentication;
    const decode = jwt.verify(responseToken, "taskToken");
    res.locals.validateUser = { status: true, decode: decode };
    next();
  } catch (error) {
    res.status(401).send({ ok: false, error: error.message });
  }
}
task.get("/", auth, async (req, res) => {
  try {
    const result = res.locals.validateUser;
    if (!result || result === "")
      return res.status(401).send({ ok: false, error: "Unauthorized user" });

    const uId = result.decode.id;

    const data = await Tasks.find({ uId: uId });
    res.send({ ok: true, data: data });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

task.post("/", auth, async (req, res) => {
  const result = res.locals.validateUser;
  if (!result || result === "")
    return res.status(401).send({ ok: false, error: "Unauthorized user" });

  const id = result.decode.id;

  const { name, description, uId, done, date, endDate, reminder } = req.body;
  if (!name || !description)
    return res.send({ ok: false, error: "Task data not complete" });
  if (name === "" || description === "")
    return res.send({ ok: false, error: "request data empty" });

  try {
    const data = await new Tasks({
      name: name,
      description: description,
      uId: id,
      done: done,
      date: date,
      endDate: endDate,
      reminder: reminder,
    }).save();

    res.send({ ok: true, body: data });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

task.put("/:id", async (req, res) => {
  const taskId = req.params.id;
  const update = req.body;

  if (taskId === "")
    return res.send({ ok: false, error: "Data Id not provided" });

  if (!update) return res.send({ ok: false, error: "Update not provided" });
  try {
    const data = await Tasks.findByIdAndUpdate(taskId, { $set: update });

    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

task.delete("/:id", async (req, res) => {
  const taskId = req.params.id;

  if (taskId === "")
    return res.send({ ok: false, error: "Task id not found " });

  try {
    const data = await Tasks.findOneAndDelete({ _id: taskId });

    if (data === null || "")
      return res.send({
        ok: false,
        error: "No task found with the provided id",
      });
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

module.exports = task;
