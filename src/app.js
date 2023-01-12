const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();
// require("../models/db");
require("./../models/db");

const userRouter = require("./../routes/user");

const User = require("./../models/user");

const app = express();

// app.use((req, re, next) => {
//   req.on("data", (chunk) => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

app.use(express.json());
// app.use(userRouter);
app.use("/.netlify/functions/app", userRouter);

const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await user.comparePassword(password);
  console.log(result);
};

//////pengecekan cocok tidak password
test("panduramadhan@email.com", "pandu1234");
//////////////
app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.get("/", (req, res) => {
  res.send('<H1 style="color:red">Hello World</H1>');
});

// app.listen(8000, () => {
//   console.log("port is listening");
// });

module.exports = app;
module.exports.handler = serverless(app);
