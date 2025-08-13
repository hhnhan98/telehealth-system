// src/components/RoleSelector.jsx
import React from 'react';

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Chọn vai trò:</label>
      <div className="flex gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded border ${
            selectedRole === 'patient' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300'
          }`}
          onClick={() => setSelectedRole('patient')}
        >
          Bệnh nhân
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded border ${
            selectedRole === 'doctor' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300'
          }`}
          onClick={() => setSelectedRole('doctor')}
        >
          Bác sĩ
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
