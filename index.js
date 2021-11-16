var express = require("express");
var bodyParser = require("body-parser");
var Mongoose = require("mongoose");
const { application, response } = require("express");

const app = express();
app.use(express.static("public"));

Mongoose.connect("mongodb://localhost:27017/mydb", 
{
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var db = Mongoose.connection;

app.post("/signup", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  var data = {
    name: name,
    email: email,
    password: password,
  };

  db.collection("players").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });

  return res.redirect("signupS.html");
});

app.post("/signin", async (req, res) => {
  try {
    const email1 = req.body.email;
    const password1 = req.body.password;
    const userEmail = await db.collection("players").findOne({ email: email1 });

    var shouldPlay = false;

    if (userEmail.password === password1) 
    {
      res.redirect('game.html');
      
      console.log("user valid and game started");
      shouldPlay = true;
    } 
    else 
    {
      console.log(userEmail.password);
      console.log("invalid user");
      shouldPlay = false;
    }

    if (shouldPlay === true) {
      app.get("/game", (req, res) => {
        return res.redirect("game.html");
      });
    } else {
      console.log("nonono");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Invalid Email ID");
  }
});

app.get("/signup", (req, res) => {
  return res.redirect("signup.html");
});

app.get("/game",(req,res)=>{
  return res.redirect("game.html");
})

app
  .get("/", function (req, res) {
    res.sendFile("D:/dsproject/public/main.html");
  })
  .listen(3000);

console.log("LISTENING TO PORT");
