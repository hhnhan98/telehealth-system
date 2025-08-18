// scripts/seedDemoData.js
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const bcrypt = require('bcrypt');

dayjs.extend(utc);
dayjs.extend(timezone);

require('dotenv').config();
const { MONGODB_URI } = process.env;

// Models
const Location = require('../models/Location');
const Specialty = require('../models/Specialty');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');

const WORK_HOURS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Clear previous data
    await Promise.all([
      Location.deleteMany({}),
      Specialty.deleteMany({}),
      Doctor.deleteMany({}),
      User.deleteMany({}),
      Schedule.deleteMany({}),
      Appointment.deleteMany({})
    ]);
    console.log('🧹 Cleared previous data');

    // 1. Locations
    const loc1 = await Location.create({ name: 'Bệnh viện A' });
    const loc2 = await Location.create({ name: 'Phòng khám B' });

    // 2. Specialties
    const spec1 = await Specialty.create({ name: 'Nhi khoa', location: loc1._id });
    const spec2 = await Specialty.create({ name: 'Tim mạch', location: loc1._id });
    const spec3 = await Specialty.create({ name: 'Da liễu', location: loc2._id });

    // 3. Users cho bác sĩ
    const doctorUser1 = await User.create({
      fullName: 'Dr. Nguyễn Văn A',
      email: 'doctorA@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'doctor'
    });

    const doctorUser2 = await User.create({
      fullName: 'Dr. Trần Thị B',
      email: 'doctorB@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'doctor'
    });

    // 4. Doctors
    const doctor1 = await Doctor.create({
      user: doctorUser1._id,
      fullName: doctorUser1.fullName,
      specialty: spec1._id, // chỉ 1 specialty
      location: loc1._id
    });

    const doctor2 = await Doctor.create({
      user: doctorUser2._id,
      fullName: doctorUser2.fullName,
      specialty: spec3._id,
      location: loc2._id
    });

    // 5. Patients
    const patient1 = await User.create({
      fullName: 'Nguyễn Văn X',
      email: 'patient1@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'patient'
    });

    const patient2 = await User.create({
      fullName: 'Trần Thị Y',
      email: 'patient2@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'patient'
    });

    // 6. Schedule cho doctor1
    const today = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    const slots = WORK_HOURS.map(time => ({ time, isBooked: false }));
    const schedule1 = await Schedule.create({
      doctor: doctor1._id,
      date: today,
      slots
    });

    // 7. Seed Appointment demo
    const apptDateTime1 = dayjs.tz(`${today} 09:00`, 'YYYY-MM-DD HH:mm', 'Asia/Ho_Chi_Minh').toDate();
    const appt1 = await Appointment.create({
      location: loc1._id,
      specialty: spec1._id,
      doctor: doctor1._id,
      patient: patient1._id,
      datetime: apptDateTime1,
      date: today,
      time: '09:00',
      reason: 'Khám sức khỏe tổng quát',
      otp: '123456',
      otpExpiresAt: dayjs().add(5, 'minute').toDate(),
      isVerified: false,
      status: 'pending'
    });

    // Cập nhật slot đã đặt
    const slotToBook = schedule1.slots.find(s => s.time === '09:00');
    if (slotToBook) slotToBook.isBooked = true;
    await schedule1.save();

    console.log('✅ Seed demo data completed');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed error:', err);
    mongoose.disconnect();
  }
}

seed();
