const express = require("express");
const authenticateJWT = require("../Middleware/authenticateJWT");
const router = express.Router();
const { getAllDoctor } = require("../Controller/Doctor");
router.get("/doctors", getAllDoctor);

module.exports = router;
