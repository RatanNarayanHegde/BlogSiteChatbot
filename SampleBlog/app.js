const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./startup/db");
const user = require("./routes/user");
const post = require("./routes/post");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
});

app.use(express.json());

app.use("/api/user", user);
app.use("/api/post", post);

app.listen(5000, () => {
  console.log("Server started at 3000");
});
