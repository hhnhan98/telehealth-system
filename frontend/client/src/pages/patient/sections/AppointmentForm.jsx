import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

function AppointmentForm() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Lấy danh sách chuyên khoa khi load component
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axiosInstance.get('/specialties');
        setSpecialties(res.data || []);
      } catch (err) {
        console.error('Lỗi fetch specialties:', err);
      }
    };
    fetchSpecialties();
  }, []);

  // Khi chọn chuyên khoa thì load danh sách bác sĩ
  useEffect(() => {
    if (!specialty) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get(`/doctors?specialty=${specialty}`);
        setDoctors(res.data || []);
      } catch (err) {
        console.error('Lỗi fetch doctors:', err);
      }
    };

    fetchDoctors();
  }, [specialty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Kiểm tra dữ liệu trước khi gửi
    if (!doctor || !date || !time) {
      setMessage('Vui lòng nhập đầy đủ thông tin.');
      setLoading(false);
      return;
    }

    const datetimeString = `${date}T${time}`;

    try {
      await axiosInstance.post('/appointments', {
        doctor,
        date: datetimeString,
        reason: notes || '',
      });

      setMessage('Đặt lịch thành công!');
      setSpecialty('');
      setDoctor('');
      setDate('');
      setTime('');
      setNotes('');
      setDoctors([]);
    } catch (err) {
      console.error('Lỗi đặt lịch:', err);
      setMessage('Đặt lịch thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đặt lịch khám</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Chuyên khoa:</label>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">-- Chọn chuyên khoa --</option>
          {specialties.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Bác sĩ:</label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          required
          style={styles.select}
          disabled={!doctors.length}
        >
          <option value="">-- Chọn bác sĩ --</option>
          {doctors.map((item) => (
            <option key={item._id} value={item._id}>
              {item.fullName}
            </option>
          ))}
        </select>

        <label style={styles.label}>Chọn ngày:</label>
        <input
          type="date"
          value={date || ''}
          onChange={(e) => setDate(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Thời gian:</label>
        <input
          type="time"
          value={time || ''}
          onChange={(e) => setTime(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Ghi chú / Triệu chứng:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Vui lòng ghi rõ triệu chứng..."
          rows={4}
          style={styles.textarea}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Đang gửi...' : 'Đặt lịch'}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

export default AppointmentForm;

const styles = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '16px',
    padding: '10px 20px',
    backgroundColor: '#59c2ffff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    color: '#59c2ffff',
    fontWeight: '500',
  },
};