const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc   Get admin dashboard stats
// @route  GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, pendingDoctors, todayAppointments] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments({ isApproved: true }),
      Appointment.countDocuments(),
      Doctor.countDocuments({ isApproved: false }),
      Appointment.countDocuments({
        appointmentDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lt: new Date(new Date().setHours(23, 59, 59, 999)) }
      }),
    ]);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email avatar')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, stats: { totalPatients, totalDoctors, totalAppointments, pendingDoctors, todayAppointments }, recentAppointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Toggle user active status
// @route  PUT /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get pending doctors for approval
// @route  GET /api/admin/doctors/pending
const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false }).populate('user', 'name email phone avatar');
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Approve or reject doctor
// @route  PUT /api/admin/doctors/:id/approve
const approveDoctors = async (req, res) => {
  try {
    const { approved } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: approved }, { new: true }).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const Notification = require('../models/Notification');
    await Notification.create({
      user: doctor.user._id,
      title: approved ? 'Doctor Profile Approved' : 'Doctor Application Rejected',
      message: approved
        ? 'Your doctor profile has been approved. You can now receive appointments.'
        : 'Your doctor application has been rejected by the admin.',
      type: 'system',
    });

    res.json({ success: true, message: `Doctor ${approved ? 'approved' : 'rejected'}`, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all appointments (admin view)
// @route  GET /api/admin/appointments
const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email avatar')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .sort({ appointmentDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(filter);
    res.json({ success: true, appointments, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats, getAllUsers, toggleUserStatus, getPendingDoctors, approveDoctors, getAllAppointments };
