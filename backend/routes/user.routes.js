const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// 📌 Lấy tất cả user (có thể lọc theo role, specialty)
router.get('/', userController.getAllUsers);

// 📌 Lấy user theo ID
router.get('/:id', userController.getUserById);

// 📌 Lấy thông tin cá nhân của user đã đăng nhập
// 👉 Để dùng được API này, cần dùng middleware xác thực JWT sau này
// router.get('/me', verifyToken, userController.getMyProfile);

// 📌 Tạo user mới
router.post('/', userController.createUser);

// 📌 Cập nhật user
router.put('/:id', userController.updateUser);

// 📌 Xoá user
router.delete('/:id', userController.deleteUser);

// 📌 Lấy danh sách bác sĩ theo chuyên khoa
router.get('/doctor/by-specialty', userController.getDoctorsBySpecialty);

module.exports = router;