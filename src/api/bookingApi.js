import axios from 'axios';

export const fetchSchedulesByDate = async (date) => {
  const res = await axios.get('/api/schedules', {
    params: { date }  
  });
  return res.data;
};
