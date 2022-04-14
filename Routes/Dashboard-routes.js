const express = require("express");

const dashboardController = require("../controllers/dashboard-controllers");

const router = express.Router();

router.get("/countorders", dashboardController.countOrders);
router.get("/countusers", dashboardController.countUsers);
router.get("/todayorders", dashboardController.todayOrders);
router.get("/gettables", dashboardController.getTables);
router.get("/getorderstotal", dashboardController.getOrdersTotal);

module.exports = router;
