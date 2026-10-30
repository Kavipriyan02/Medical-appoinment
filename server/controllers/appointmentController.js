const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

// @desc   Book an appointment
// @route  POST /api/appointments
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, type, reason, symptoms } = req.body;

    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (!doctor.isApproved || !doctor.isAvailable) {
      return res.status(400).json({ success: false, message: 'Doctor is not available' });
    }

    // Check for slot conflict
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $nin: ['cancelled'] },
    });
    if (conflict) return res.status(400).json({ success: false, message: 'This time slot is already booked' });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      type: type || 'in-person',
      reason,
      symptoms: symptoms || [],
      fee: doctor.consultationFee,
    });

    // Send notification to doctor
    await Notification.create({
      user: doctor.user._id,
      title: 'New Appointment Booked',
      message: `A patient has booked an appointment on ${new Date(appointmentDate).toDateString()} at ${timeSlot}`,
      type: 'appointment',
      relatedId: appointment._id,
    });

    // Send notification to patient
    await Notification.create({
      user: req.user._id,
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${doctor.user.name} on ${new Date(appointmentDate).toDateString()} at ${timeSlot} is pending confirmation.`,
      type: 'appointment',
      relatedId: appointment._id,
    });

    const populated = await appointment.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'doctor', populate: { path: 'user', select: 'name avatar' } },
    ]);

    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get patient's appointments
// @route  GET /api/appointments/my
const getMyAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { patient: req.user._id };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar phone' } })
      .populate('prescription')
      .sort({ appointmentDate: -1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get doctor's appointments
// @route  GET /api/appointments/doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const filter = { doctor: doctorProfile._id };
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      filter.appointmentDate = { $gte: d, $lt: new Date(d.getTime() + 86400000) };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone avatar gender dateOfBirth bloodGroup')
      .populate('prescription')
      .sort({ appointmentDate: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update appointment status (doctor confirms/cancels)
// @route  PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes, cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.status = status;
    if (notes) appointment.notes = notes;
    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
      appointment.cancelledBy = req.user.role;
    }
    await appointment.save();

    // Notify patient
    const msg = status === 'confirmed'
      ? `Your appointment with Dr. ${appointment.doctor.user.name} has been confirmed!`
      : status === 'cancelled'
      ? `Your appointment with Dr. ${appointment.doctor.user.name} has been cancelled. Reason: ${cancellationReason || 'Not specified'}`
      : `Your appointment status has been updated to: ${status}`;

    await Notification.create({
      user: appointment.patient._id,
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: msg,
      type: 'appointment',
      relatedId: appointment._id,
    });

    res.json({ success: true, message: `Appointment ${status}`, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Cancel appointment (by patient)
// @route  PUT /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = 'patient';
    appointment.cancellationReason = cancellationReason || 'Cancelled by patient';
    await appointment.save();

    const doctor = await require('../models/Doctor').findById(appointment.doctor).populate('user', 'name _id');
    await Notification.create({
      user: doctor.user._id,
      title: 'Appointment Cancelled',
      message: `Patient has cancelled the appointment scheduled for ${appointment.appointmentDate.toDateString()} at ${appointment.timeSlot}`,
      type: 'appointment',
      relatedId: appointment._id,
    });

    res.json({ success: true, message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get single appointment
// @route  GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar gender dateOfBirth bloodGroup address')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar phone' } })
      .populate('prescription');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { bookAppointment, getMyAppointments, getDoctorAppointments, updateAppointmentStatus, cancelAppointment, getAppointmentById };
