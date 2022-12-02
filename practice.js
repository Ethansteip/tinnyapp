const bcrypt = require("bcryptjs");

console.log(bcrypt.hashSync("dummy", 10));
