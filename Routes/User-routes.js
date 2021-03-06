const express = require("express");

const usersController = require("../controllers/user-controllers");

const router = express.Router();

router.post("/register", usersController.signup);
router.post("/login", usersController.login);

module.exports = router;
