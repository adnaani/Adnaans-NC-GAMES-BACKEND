const express = require("express");
const { getAllCategories } = require("./controller/categories");
const { getReviewById, patchReviewById } = require("./controller/reviews");
const { getAllUsers } = require("./controller/users");
const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getAllUsers);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "invalid endpoint" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "input is not valid" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "input is missing" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "internal server error" });
});
module.exports = app;
