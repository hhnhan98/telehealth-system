import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    role: '',
    specialty: '', // hiển thị nếu là doctor
    password: ''   // chỉ để cập nhật
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        const data = res.data;

        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
          role: data.role || '',
          specialty: data.specialty?.name || '',
          password: '' // để trống lúc đầu
        });

      } catch (err) {
        console.error('Lỗi khi tải hồ sơ:', err);
        setError('Không thể tải hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updatedProfile = {};

      // Chỉ gửi các trường cho phép cập nhật
      ['fullName', 'phone', 'gender', 'dateOfBirth', 'password'].forEach((key) => {
        if (profile[key]) {
          updatedProfile[key] = profile[key];
        }
      });

      if (Object.keys(updatedProfile).length === 0) {
        setError('Vui lòng nhập ít nhất một trường để cập nhật.');
        return;
      }

      await axiosInstance.put('/users/me', updatedProfile);
      setMessage('Cập nhật hồ sơ thành công!');
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      setError('Có lỗi xảy ra khi cập nhật hồ sơ.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Hồ sơ cá nhân</h2>

      {loading ? (
        <p style={styles.infoText}>Đang tải dữ liệu...</p>
      ) : (
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Họ tên
            <input
              style={styles.input}
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="Nhập họ tên"
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              style={{ ...styles.input, backgroundColor: '#F3F4F6' }}
              type="email"
              value={profile.email}
              disabled
            />
          </label>

          <label style={styles.label}>
            Số điện thoại
            <input
              style={styles.input}
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </label>

          <label style={styles.label}>
            Giới tính
            <select
              style={styles.input}
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </label>

          <label style={styles.label}>
            Ngày sinh
            <input
              style={styles.input}
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
            />
          </label>

          {profile.role === 'doctor' && (
            <label style={styles.label}>
              Chuyên khoa
              <input
                style={{ ...styles.input, backgroundColor: '#F3F4F6' }}
                type="text"
                value={profile.specialty}
                disabled
              />
            </label>
          )}

          <label style={styles.label}>
            Mật khẩu mới
            <input
              style={styles.input}
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
            />
          </label>

          <button type="submit" style={styles.submitBtn}>
            Lưu thay đổi
          </button>

          {message && <p style={{ ...styles.message, color: '#059669' }}>{message}</p>}
          {error && <p style={{ ...styles.message, color: '#DC2626' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default Profile;

// === CSS Styles (Inline) ===
const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
    maxWidth: '600px',
    margin: '40px auto'
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1F2937',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    display: 'block',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#374151'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    marginTop: '6px',
    backgroundColor: '#fff'
  },
  submitBtn: {
    padding: '12px 20px',
    backgroundColor: '#59c2ffff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px'
  },  
  message: {
    marginTop: '12px',
    fontSize: '14px'
  },
  infoText: {
    fontSize: '14px',
    color: '#6B7280'
  }
};
