const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc   Get all approved doctors
// @route  GET /api/doctors
const getDoctors = async (req, res) => {
  try {
    const { specialization, search, sort, page = 1, limit = 12 } = req.query;
    const filter = { isApproved: true, isAvailable: true };

    if (specialization && specialization !== 'all') {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }

    let doctors = await Doctor.find(filter)
      .populate('user', 'name email avatar phone gender')
      .sort(sort === 'rating' ? { rating: -1 } : sort === 'experience' ? { experience: -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      doctors = doctors.filter(d =>
        (d.user && d.user.name && d.user.name.toLowerCase().includes(search.toLowerCase())) ||
        (d.specialization && d.specialization.toLowerCase().includes(search.toLowerCase())) ||
        (d.hospital && d.hospital.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const total = await Doctor.countDocuments(filter);
    res.json({ success: true, doctors, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get single doctor
// @route  GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email avatar phone gender')
      .populate('reviews.patient', 'name avatar');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update doctor profile (by doctor)
// @route  PUT /api/doctors/profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, qualifications, experience, consultationFee, about, hospital, languages, availableSlots } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { specialization, qualifications, experience, consultationFee, about, hospital, languages, availableSlots },
      { new: true }
    ).populate('user', 'name email avatar phone');
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get doctor's own profile
// @route  GET /api/doctors/my-profile
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email avatar phone gender');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Add review for a doctor
// @route  POST /api/doctors/:id/review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Check if already reviewed
    const alreadyReviewed = doctor.reviews.find(r => r.patient.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this doctor' });
    }

    doctor.reviews.push({ patient: req.user._id, rating, comment });
    const totalRating = doctor.reviews.reduce((sum, r) => sum + r.rating, 0);
    doctor.rating = (totalRating / doctor.reviews.length).toFixed(1);
    doctor.totalReviews = doctor.reviews.length;
    await doctor.save();

    res.json({ success: true, message: 'Review added successfully', doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get specializations list
// @route  GET /api/doctors/specializations
const getSpecializations = async (req, res) => {
  try {
    const specs = await Doctor.distinct('specialization', { isApproved: true });
    res.json({ success: true, specializations: specs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDoctors, getDoctorById, updateDoctorProfile, getMyDoctorProfile, addReview, getSpecializations };
