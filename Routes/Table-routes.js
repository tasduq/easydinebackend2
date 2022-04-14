const express = require("express");

const tableController = require("../controllers/table-controllers");

const router = express.Router();

router.post("/addtable", tableController.addTable);
router.get("/gettables", tableController.getTables);
router.post("/deletetable", tableController.deleteTable);
router.post("/edittable", tableController.editTable);

module.exports = router;
