const fs = require("fs");
const path = require("path");

const length = fs.readdirSync("/test").length;
console.log(length);
//userID
//binisID
var userID = 5;
var binisID = 4;
fs.mkdir(path.join(__dirname, "eldari/eldo"), err => {
  if (err) {
    return console.error(err);
  }
  console.log("Directory created successfully!");
});
