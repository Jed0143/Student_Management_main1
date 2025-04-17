import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root", // Change if you set a password
  password: "", // Add password if set
  database: "mpcar",
});

export default db;
