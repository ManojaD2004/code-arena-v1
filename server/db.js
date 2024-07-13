const postgres = require("postgres");
const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "postgres",
});

module.exports = sql;
