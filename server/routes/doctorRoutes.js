const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateDoctorProfile, getMyDoctorProfile, addReview, getSpecializations } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/specializations', getSpecializations);
router.get('/my-profile', protect, authorize('doctor'), getMyDoctorProfile);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/:id', getDoctorById);
router.post('/:id/review', protect, authorize('patient'), addReview);

module.exports = router;
