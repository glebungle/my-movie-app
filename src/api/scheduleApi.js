import axios from 'axios';

const API_BASE = '/api/schedules';

export const registerSchedule = async (data) => {
  return axios.post(`${API_BASE}/register`, data);
};

export const deleteSchedule = async (scheduleId) => {
  return axios.delete(`${API_BASE}/delete`, {
    data: { scheduleId },
  });
};
