const Product = require("../models/products"); //importing product schema from models
const { default: mongoose, get } = require("mongoose");

exports.product_getall = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((docs) => {
          return {
            name: docs.name,
            price: docs.price,
            _id: docs._id,
            productImage: docs.productImage,
            request: {
              type: "GET",
              url: "http://localhost:8000/products/" + docs._id, //we are doing this so that we get a url and clicking on it gives detailed information about the product
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_post = (req, res, next) => {
  //we are able to use this .body only bcoz of the body parser, used to extract data from the request
  console.log(req.file); //data.file is available due to the middle upload that we added just now
  // if (!req.file) return res.send("Please upload a file");
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  }); //creating instance of a model and passing js file to Product constructor
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "successfully added a product",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:8000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err + "This is a error",
        });
    }); //method to store the info in db provided by mongoose
};

exports.product_getone = (req, res, next) => {
  const id = req.params.productId; //exec() is used to convert the reuest into a promise, so that we can use then and catch;
  Product.findById(id)
    // .exec()
    .select("name price _id productImage")
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.product_patch = (req, res, next) => {
  const id = req.params.productId;
  //To send different type of patch request we will initialize an empty object and then read the request about how many parameter are being updated and enter
  //then in the empty object and finally pass that object in the set
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "get",
          url: "http://localhost:8000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }); //second argurment how we want to update it, $set is understood by mongoose
};

exports.product_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "Post",
          url: "http://localhost:8000/products",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
