const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_user");
const orderController = require("../controllers/orders");

router.get("/", checkAuth, orderController.order_getall);
router.post("/", checkAuth, orderController.order_post);
router.get("/:orderId", checkAuth, orderController.order_getone);
router.delete("/:orderId", checkAuth, orderController.order_delete);

module.exports = router;
