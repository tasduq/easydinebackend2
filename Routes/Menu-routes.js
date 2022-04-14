const express = require("express");

const menuController = require("../controllers/menu-controllers");

const router = express.Router();

router.get("/get", menuController.getMenu);
router.post("/addmenu", menuController.addMenu);

router.post("/addsection", menuController.addSection);
router.post("/deletesection", menuController.deleteSection);
router.post("/editsection", menuController.editSection);

router.post("/additem", menuController.addItem);
router.post("/deleteitem", menuController.deleteItem);
router.post("/edititem", menuController.editItem);

module.exports = router;
