const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/auth_user");
const productController = require("../controllers/products");

//Defining how muler stores the file
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  //minetype is automatically provided by multer
  // if (file.minetype === "image/jpeg" || file.minetype === "image/png") {
  //Accept a file
  cb(null, true);
  // } else {
  //Reject a file
  // cb(null, false);
  // }
};

//If we want to have some filters like constraining file size
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//To take image input we have two approach,
// 1. making another end point that accepts binary data
// 2. Easier, use multer library and take multipart form as input.

router.get("/", productController.product_getall);

//In the post method checkAuth is throwing error to solve it we can change the order and parse the body first then extract the token from there or
// We can send the token in the header file in the same request which we are doing right now. header -> Authorization -> bearer <Token>

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productController.product_post
);

router.get("/:productId", productController.product_getone);

router.patch("/:productId", checkAuth, productController.product_patch);

router.delete("/:productId", checkAuth, productController.product_delete);

module.exports = router;
