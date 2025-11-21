// src/api/screenApi.js
import axios from 'axios';

const API_BASE = '/api/screens';

export const registerScreen = async (screenName, seats) => {
  return axios.post(`${API_BASE}/register`, {
    screenName,
    seats,
  });
};

export const deleteScreen = async (screenName) => {
  return axios.delete(`${API_BASE}/delete`, {
    data: { screenName },
  });
};
