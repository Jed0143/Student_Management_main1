const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());

mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mpcar"
});

app.get("/", (req, res) => {
        const sql = "SELECT * FROM pre_enrollment";
        db.query(sql, (err, data) => {
            if(err) return res.json("Error");
            return res.json(data);
        })
    });

app.listen(5000, () => {
    console.log("Listening");
})