const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, toggleUserStatus, getPendingDoctors, approveDoctors, getAllAppointments } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:id/approve', approveDoctors);
router.get('/appointments', getAllAppointments);

module.exports = router;
