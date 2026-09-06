const bcrypt = require("bcryptjs");

bcrypt.hash("admin1234", 10).then(console.log);