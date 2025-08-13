function Appointment() {
  return (
    <div>
      <h2 style={styles.heading}>Đặt lịch hẹn</h2>
      <p style={styles.text}>Chức năng đặt lịch hẹn sẽ được triển khai tại đây.</p>
    </div>
  );
}

export default Appointment;

const styles = {
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  text: {
    fontSize: '14px',
    color: '#4B5563'
  }
};
