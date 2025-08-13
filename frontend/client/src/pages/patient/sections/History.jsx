import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get('/appointments/history');
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu lịch sử');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Lịch sử đặt lịch hẹn</h2>

      {loading && <p style={styles.infoText}>Đang tải dữ liệu...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p style={styles.infoText}>Chưa có lịch hẹn nào trong quá khứ.</p>
      )}

      {!loading && !error && appointments.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Bác sĩ</th>
              <th style={styles.th}>Chuyên khoa</th>
              <th style={styles.th}>Ngày</th>
              <th style={styles.th}>Giờ</th>
              <th style={styles.th}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td style={styles.td}>{appt.doctorName}</td>
                <td style={styles.td}>{appt.specialty}</td>
                <td style={styles.td}>{appt.date}</td>
                <td style={styles.td}>{appt.time}</td>
                <td style={{ ...styles.td, color: appt.status === 'Đã xác nhận' ? '#16A34A' : '#DC2626' }}>
                  {appt.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AppointmentHistory;

// === Styles ===
const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1F2937'
  },
  infoText: {
    fontSize: '14px',
    color: '#6B7280'
  },
  errorText: {
    fontSize: '14px',
    color: '#DC2626'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#F3F4F6',
    color: '#374151',
    borderBottom: '1px solid #E5E7EB'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #E5E7EB',
    color: '#374151'
  }
};