const MedicalRecord = require('../models/MedicalRecord');

// @desc   Add medical record
// @route  POST /api/medical-records
const addMedicalRecord = async (req, res) => {
  try {
    const { title, type, description, date, tags, fileUrl, appointmentId } = req.body;
    const record = await MedicalRecord.create({
      patient: req.user._id,
      title, type, description,
      date: date || Date.now(),
      tags: tags || [],
      fileUrl,
      appointment: appointmentId,
    });
    res.status(201).json({ success: true, message: 'Medical record added', record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get patient's medical records
// @route  GET /api/medical-records/my
const getMyMedicalRecords = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { patient: req.user._id };
    if (type) filter.type = type;

    const records = await MedicalRecord.find(filter)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Delete medical record
// @route  DELETE /api/medical-records/:id
const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ _id: req.params.id, patient: req.user._id });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    await record.deleteOne();
    res.json({ success: true, message: 'Medical record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get patient records by doctor (for consultation)
// @route  GET /api/medical-records/patient/:patientId
const getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addMedicalRecord, getMyMedicalRecords, deleteMedicalRecord, getPatientRecords };
