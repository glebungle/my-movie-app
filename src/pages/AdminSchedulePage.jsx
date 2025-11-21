import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { registerSchedule, deleteSchedule } from '../api/scheduleApi';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function AdminSchedulePage() {
  const [movieTitle, setMovieTitle] = useState('');
  const [screenName, setScreenName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true });
        if (res.data.role === 'ADMIN') setIsAdmin(true);
        else setIsAdmin(false);
      } catch {
        setIsAdmin(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      axios
        .get(`/api/schedules?date=${selectedDate}`)
        .then((res) => setSchedules(res.data))
        .catch(() => setSchedules([]));
    }
  }, [selectedDate]);

  const handleRegister = async () => {
    try {
      const res = await registerSchedule({
        movieTitle,
        screenName,
        startTime,
        endTime,
      });
      setMessage(res.data.message);
    } catch (err) {
      if (err.response?.data?.message?.includes('ORA-00001')) {
        setMessage('선택된 상영관의 상영일정 중 시간이 중복된 상영일정이 이미 존재합니다.');
      } else {
        setMessage(err.response?.data?.message || '등록 실패');
      }
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      const res = await deleteSchedule(scheduleId);
      setMessage(res.data.message);
      setSchedules(schedules.filter((s) => s.scheduleId !== scheduleId));
    } catch (err) {
      setMessage(err.response?.data?.message || '삭제 실패');
    }
  };

  if (!isAdmin) return <div style={{ padding: '2rem' }}>관리자만 접근 가능합니다.</div>;

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem' }}>
        <button className="back-button" onClick={() => navigate('/admin')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>상영일정 등록</h2>
        <input
          type="text"
          placeholder="영화 제목"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="상영관 이름"
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="시작 시간"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="종료 시간"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleRegister}>등록</button>

        <hr />

        <h2>등록된 일정 목록 (날짜 선택)</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {schedules.map((sch) => (
          <div key={sch.scheduleId} style={{ margin: '1rem 0', padding: '0.5rem', border: '1px solid #ccc' }}>
            <strong>{sch.movieTitle}</strong> / {sch.screenName}<br />
            {sch.startTime} ~ {sch.endTime} / {sch.availableSeats}석 남음
            <br />
            <button onClick={() => handleDelete(sch.scheduleId)}>삭제</button>
          </div>
        ))}

        <hr />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default AdminSchedulePage;
