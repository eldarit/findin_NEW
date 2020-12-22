const bcrypt = require("bcrypt");

let pass = bcrypt.hashSync("1234", 9);
console.log(pass);
