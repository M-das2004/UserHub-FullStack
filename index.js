const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path=require("path");
const methodOverride=require("method-override");
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test',
  password: 'Meghma@2004#',
});

/* ---------------- HOME ---------------- */
app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) AS count FROM user";

  connection.query(q, (err, result) => {
    if (err) return res.send("Database Error");
    res.render("home.ejs", { count: result[0].count });
  });
});

/* ---------------- SHOW USERS ---------------- */
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";

  connection.query(q, (err, users) => {
    if (err) return res.send("Database Error");
    res.render("show.ejs", { users });
  });
});

/* ---------------- NEW USER FORM ---------------- */
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

/* ---------------- CREATE USER ---------------- */
app.post("/user", (req, res) => {
  let { id, username, email, password } = req.body;

  let q =
    "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";

  connection.query(q, [id, username, email, password], (err) => {
    if (err) {
      console.log(err);
      return res.send("Insert Error");
    }
    res.redirect("/user");
  });
});

/* ---------------- EDIT USER ---------------- */
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;

  let q = "SELECT * FROM user WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("Database Error");
    if (result.length === 0) return res.send("User not found");

    res.render("edit.ejs", { user: result[0] });
  });
});

/* ---------------- UPDATE USER ---------------- */
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;

  let q = "SELECT * FROM user WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("Database Error");
    if (result.length === 0) return res.send("User not found");

    let user = result[0];

    if (formPass !== user.password) {
      return res.send("Wrong Password");
    }

    let q2 = "UPDATE user SET username = ? WHERE id = ?";

    connection.query(q2, [newUsername, id], (err) => {
      if (err) return res.send("Update Error");
      res.redirect("/user");
    });
  });
});

/* ---------------- DELETE USER ---------------- */

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;

  let q = "SELECT * FROM user WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("Database Error");
    if (result.length === 0) return res.send("User not found");

    res.render("delete.ejs", { user: result[0] });
  });
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, email: emailPass } = req.body;

  let q = "SELECT * FROM user WHERE id = ?";

  connection.query(q, [id], (err, result) => {
    if (err) return res.send("Database Error");
    if (result.length === 0) return res.send("User not found");

    let user = result[0];

    if (formPass !== user.password) {
      return res.send("Wrong Password");
    }

    if (emailPass !== user.email) {
      return res.send("Wrong Email");
    }

    let q2 = "DELETE FROM user WHERE id = ?";

    connection.query(q2, [id], (err) => {
      if (err) return res.send("Delete Error");
      res.redirect("/user");
    });
  });
});


/* ---------------- SERVER ---------------- */
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

//const getRandomUser = () => ([
//  faker.string.uuid(),
//  faker.internet.username(),
//  faker.internet.email(),
//  faker.internet.password(),
//]);


//const q = "INSERT INTO user (id, username, email, password) VALUES ?";
//let data = [];
//for (let i = 0; i < 100; i++) {
//  data.push(getRandomUser());
//}
//connection.query(q, [data], (err, result) => {
//  if (err) {
//    console.error("Insert error:", err);
//  } else {
//    console.log("Rows inserted:", result.affectedRows);
//  }
//  connection.end(); 
//});

//app.get("/", (req, res) => {
//  let q = "SELECT COUNT(*) AS count FROM user";
//
//  connection.query(q, (err, result) => {
//    if (err) {
//      console.log(err);
//      return res.send("Some error in Database");
//    }
//
//    let count = result[0].count;
//    res.render("home.ejs", { count });
//  });
//});
//
//app.get("/user", (req, res) => {
//  let q = "SELECT * FROM user";
//  connection.query(q, (err, users) => {
//    if (err) {
//      console.log(err);
//      return res.send("Some error in Database");
//    }
//    res.render("show.ejs", { users });
//  });
//});
//
//app.get("/user/:id/edit", (req, res) => {
//  let { id } = req.params;
//
//  let q = `SELECT * FROM user WHERE id='${id}'`;
//
//  connection.query(q, (err, result) => {
//    if (err) {
//      console.log(err);
//      return res.send("Some error in Database");
//    }
//
//    let user = result[0]; 
//    res.render("edit.ejs", { user });
//  });
//});
//
//app.patch("/user/:id", (req, res) => {
//  let { id } = req.params;
//  let { password: formPass, username: newUsername } = req.body;
//
//  let q = "SELECT * FROM user WHERE id = ?";
//
//  connection.query(q, [id], (err, result) => {
//    if (err) {
//      console.log(err);
//      return res.send("Some error in Database");
//    }
//
//    if (result.length === 0) {
//      return res.send("User not found");
//    }
//
//    let user = result[0];
//    if (formPass !== user.password) {
//      return res.send("Wrong Password");
//    }
//    let q2 = "UPDATE user SET username = ? WHERE id = ?";
//
//    connection.query(q2, [newUsername, id], (err) => {
//      if (err) {
//        console.log(err);
//        return res.send("Some error in Database");
//      }
//      res.redirect("/user");
//    });
//  });
//});
//
//app.get("/user/new", (req, res) => {
//    res.render("new.ejs");
//});
//
//app.listen(8080, () => {
//  console.log("Server is listening on port 8080");
//});
//