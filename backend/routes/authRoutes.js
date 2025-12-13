const express = require('express');
const authController = require('../controller/authcontroller.js');

const router = express.Router();
// Admin Login Route
router.post('/admin/login', authController.adminLogin);

module.exports = router;