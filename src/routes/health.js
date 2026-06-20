const express = require("express");
const router = express.Router();
const { healthCheck } = require("../controllers/healthController");
const limiter = require("../middlewares/limiter");

router.get("/", limiter, healthCheck);

module.exports = router;
