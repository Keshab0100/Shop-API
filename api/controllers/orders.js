const Order = require("../models/orders");
const mongoose = require("mongoose");
const Product = require("../models/products");

// For save() you get a real promise by default but when we use/pass an id in the url it only give then() by default and to get catch() we add exec() there

exports.order_getall = (req, res, next) => {
  Order.find()
    .populate("product", "name") // This is used to get product info, i.e, we merge details product info, 1st argument is name of your reference property
    .then((result) => {
      res.status(200).json({
        count: result.length,
        orders: result.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "get",
              url: "http://localhost:8000/order/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.order_post = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((doc) => {
      res.status(201).json({
        message: "item ordered succesfully",
        createOrder: {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
        },
        request: {
          type: "get",
          url: "http://localhost:8000/order" + doc._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    });
};

exports.order_getone = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "file not found",
        });
      }
      res.status(200).json({
        orders: order,
        request: {
          type: "get",
          url: "http://localhost:8000/order" + order._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.order_delete = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "post",
          url: "http://localhost:8000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    });
};
