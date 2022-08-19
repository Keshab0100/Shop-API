const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser"); // Used to parse the body of incoming requests, it doesn't support file but it supports json and urlencoded data(only parses these data)
const mongoose = require("mongoose");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads")); //To make the file statically/locally available
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //we are including these headers so that any client can access the api, we can also be ssleective by replacing the * with ex: http://keshab.com
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    //Options is a request that a browser sends when we send a post or put request,
    res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const productRoute = require("./api/routes/product");
const orderRoute = require("./api/routes/order");
const userRoute = require("./api/routes/user");
const { application } = require("express");

mongoose.connect(
  "mongodb+srv://Guest:123456%40guest@cluster0.aph2g9d.mongodb.net/?retryWrites=true&w=majority"
);

app.use("/products", productRoute);
app.use("/order", orderRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status(404);
  next(error); //this will actually forward the error request instead of default request.
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
