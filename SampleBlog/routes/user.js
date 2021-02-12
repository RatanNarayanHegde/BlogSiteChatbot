const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../startup/db");

// let isLoggedIn = false;

router.get("/:user_name", (req, res) => {
  db.query(
    "SELECT * FROM User WHERE user_name=?",
    [req.params.user_name],
    (error, results, fields) => {
      if (error) {
        res.send("Username already taken");
        return;
      }
      res.send(results);
    }
  );
});

router.post("/register", (req, res) => {
  // console.log(req.body);
  const hash_password = bcrypt.hashSync(req.body.password, 10);
  db.query(
    `INSERT INTO User(user_name,email,password,Name,role_id) VALUES(?,?,?,?,1)`,
    [req.body.user_name, req.body.email, hash_password, req.body.name],
    (error, results, fields) => {
      if (error) {
        res.status(402).send(error.sqlMessage);
        return console.log(error);
      }
      req.session.loggedin = true;
      req.session.username = req.body.user_name;

      // console.log(results);
      res.send("success");
    }
  );
});

router.post("/login", (req, res) => {
  db.query(
    `SELECT * FROM User WHERE user_name=?`,
    [req.body.user_name],
    (error, results, fields) => {
      if (error) {
        res.send("database error");
        return;
      }
      if (results.length != 1) {
        res.send("Invalid user name");
        return;
      }
      const curr_password = req.body.password;
      if (bcrypt.compareSync(curr_password, results[0].password)) {
        req.session.username = req.body.user_name;
        req.session.loggedin = true;
        res.send("success");
      } else {
        res.send("Invalid Password");
      }
    }
  );
});

router.post("/logout", (req, res) => {
  req.session.loggedin = false;
  res.send("success");
});

module.exports = router;
