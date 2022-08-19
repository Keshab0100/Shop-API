const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    // console.log(token); O/P -> bearer <token>
    // to remove this bearer and space we split it and take the index 1 element
    const decoded = jwt.verify(token, process.env.jwt_key);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed again",
      error: error,
    });
  }
};
