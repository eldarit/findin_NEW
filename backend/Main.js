const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const Router = require("./Router");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { mainModule } = require("process");
const { stat } = require("fs");

const saltRounds = 10;

app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});
db.connect(function (err) {
  if (err) {
    console.log("db_error");
    return false;
  }
});

const sessionStore = new MySQLStore(
  {
    expiration: 1815 * 51516 * 516,
    endConnectionOnclose: false,
  },
  db
);

app.use(
  session({
    key: "864aasdass49d4as6da4da",
    secret: "asd6asda56d2as2d6a6asdas",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1815 * 51516 * 516,
      httpOnly: false,
    },
  })
);

new Router(app, db);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/registration", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/search", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/agent", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/add", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/service", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.send(result);
      console.log(result);
      return;
    }
  });
});
app.post("/register", (req, res) => {
  let username = req.body.username;
  let surname = req.body.surname;
  let mail = req.body.mail;
  let piradi = req.body.idNom;
  let phone = req.body.userPnumber;
  let password = req.body.userPass;
  if (
    username.length > 25 ||
    password.length > 25 ||
    surname.length > 25 ||
    phone.length > 25
  ) {
    res.json({
      success: false,
      msg: "მონაცემები არასწორია!",
    });
    return;
  }
  if (piradi.length > 11) {
    res.json({
      success: false,
      msg: "პირადი ნომერი არასწორია!",
    });
    return;
  } else if (username.length < 5 || surname.length < 5) {
    res.json({
      success: false,
      msg: "გთხოვთ შეიყვანოთ მონაცემები!",
    });
    return;
  }
  db.query(
    "SELECT mail FROM users WHERE mail = ?",
    mail,
    (err, data, fields) => {
      if (err) {
        res.json({
          success: false,
          msg: "მონაცემები არასწორია!",
        });
        return;
      } else if (data && data.length > 0) {
        res.json({
          success: false,
          msg: "ეს მაილი დაკავებულია",
        });
        return;
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          db.query(
            "INSERT INTO users (saxeli, gvari,mail, piradi_nomeri, phone, password) VALUES (?,?,?,?,?,?)",
            [username, surname, mail, piradi, phone, hash],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.json({
                  success: true,
                  msg: "თქვენ წარმატებით გაიარეთ რეგისტრაცია!",
                });
              }
            }
          );
        });
      }
    }
  );
});

app.post("/create", (req, res) => {
  const title = req.body.title;
  const price = req.body.price;
  const bedroom = req.body.bedroom;
  const sartuli = req.body.sartuli;
  const kvadrati = req.body.kvadrati;
  const roomcount = req.body.roomcount;
  const description = req.body.description;

  if (
    title == "" ||
    price == "" ||
    sartuli == "" ||
    kvadrati == "" ||
    roomcount == ""
  ) {
    res.send("გთხოვთ შეიყვანოთ მონაცემები");
    return;
  } else if (!Number.isInteger(price)) {
    res.send("თანხის ველში შეიყვანეთ მხოლოდ რიცხვები");
    return;
  }
  db.query(
    "INSERT INTO employees (price, kvadrati, roomcount, bedroom, sartuli, title, description) VALUES (?,?,?,?,?,?,?)",
    [price, kvadrati, roomcount, bedroom, sartuli, title, description],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Yey, your server is running on port 3000");
});
