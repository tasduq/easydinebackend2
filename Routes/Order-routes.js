const express = require("express");

const orderController = require("../controllers/order-controllers");

const router = express.Router();

router.get("/getorders", orderController.getOrders);
router.get("/getreviews", orderController.getReviews);
router.post("/getuserorders", orderController.getUserOrders);
router.post("/submitreview", orderController.submitReview);

router.post("/updateorderstatus", orderController.updateOrderStatus);
router.post("/placeorderwithuser", orderController.placeOrderWithUser);
router.post("/placeorderwithoutuser", orderController.placeOrderWithoutUser);

module.exports = router;
