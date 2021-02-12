const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "BlogSite",
});

db.connect(function (err) {
  if (err) return console.log(err);
  else console.log("connected to db");
});

module.exports = db;
