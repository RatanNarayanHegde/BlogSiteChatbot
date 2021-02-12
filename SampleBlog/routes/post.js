const express = require("express");
const router = express.Router();
const db = require("../startup/db");

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://vinay:vinay123@cluster0.kcxi8.mongodb.net/test?authSource=admin&replicaSet=atlas-6limwk-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

router.get("/", (req, res) => {
  db.query("SELECT * from Post", [], (error, results, fields) => {
    if (error) return console.log(error);
    res.send(results);
  });
});

router.post("/new", (req, res) => {
  db.query(
    `INSERT INTO Post(title,post_summary,post_content,likes,post_user_name,post_date) VALUES('${req.body.title}','${req.body.post_summary}','${req.body.post_content}',0,'${req.body.user_name}',CURRENT_TIME)`,
    (error, results, fields) => {
      if (error) return console.log(error);

      MongoClient.connect(url, function (err, db) {
        const link = `/post/${results.insertId}`;
        if (err) throw err;
        dbo = db.db("Post");
        var myobj = {
          post_link: link,
          post_content: req.body.post_content,
        };
        dbo.collection("postContent").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });

      res.send(results);
    }
  );
});

router.get("/:post_id", (req, res) => {
  db.query(
    "SELECT * FROM Post WHERE post_id=?",
    [req.params.post_id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.send(results);
    }
  );
});

router.put("/:post_id", (req, res) => {
  db.query(
    "UPDATE Post SET title=?, post_summary=?, post_content=? WHERE post_id=?",
    [
      req.body.title,
      req.body.post_summary,
      req.body.post_content,
      req.params.post_id,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.send("Success");
    }
  );
});

router.delete("/:post_id", (req, res) => {
  db.query(
    "DELETE FROM Post WHERE post_id=?",
    [req.params.post_id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.send("Success");
    }
  );
});

router.get("/:post_id/comments", (req, res) => {
  db.query(
    "SELECT * FROM Comment WHERE post_id=?",
    [req.params.post_id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.send(results);
    }
  );
});

router.post("/:post_id/comment/new", (req, res) => {
  db.query(
    "INSERT INTO Comment(comm_title,comm_date,post_id,user_name) VALUES(?,CURRENT_TIME,?,?)",
    [req.body.comm_title, req.params.post_id, req.body.user_name],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.send("success");
    }
  );
});

module.exports = router;
