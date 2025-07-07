const express = require('express');
const router = express.Router();
const SuperAdminController = require('../controllers/SuperAdminController');
const { requireAuth, requireRole } = require('../middlewares/AuthMiddleware');

router.get('/', requireAuth, requireRole('superAdmin'), SuperAdminController.getSuperAdminDashboard);

module.exports = router;
