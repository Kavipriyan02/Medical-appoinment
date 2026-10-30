const express = require('express');
const router = express.Router();
const { addMedicalRecord, getMyMedicalRecords, deleteMedicalRecord, getPatientRecords } = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, addMedicalRecord);
router.get('/my', protect, getMyMedicalRecords);
router.delete('/:id', protect, deleteMedicalRecord);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), getPatientRecords);

module.exports = router;
