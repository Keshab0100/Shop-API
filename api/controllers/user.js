const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.user_signup = (req, res, next) => {
  // password: req.body.password,
  // The major flaw here is that the user password is getting stored in our database just like that
  //and anyone can read it from there is they ever get the access which is not right so we have to encrypt it and we will use bycrpt for that, for hashing our passwordds.

  //Checking if user already exists
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        //Checking the length bcoz user won't return a null value if user doesn't exist rather it will return an empty array
        return res.status(409).json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                return res.status(200).json({
                  message: "user created succesfully",
                  id: result._id,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
        });
        //the variable 10 is the no. of salting rounds so that if the user password is very simple it can't be looked up it the dictionary table
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.jwt_key,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.user_delete = (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
