import React from 'react';

const RecordItem = ({ record }) => {
  return (
    <div className="record-item">
      <h4>{record.diagnosis}</h4>
      <p><strong>Triệu chứng:</strong> {record.symptoms}</p>
      <p><strong>Ngày khám:</strong> {new Date(record.createdAt).toLocaleDateString()}</p>
      <p><strong>Ghi chú:</strong> {record.notes || 'Không có'}</p>
    </div>
  );
};

export default RecordItem;