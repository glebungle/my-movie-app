import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import './AdminEventPage.css';
import { useNavigate } from 'react-router-dom';

function AdminEventPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    eventName: '',
    eventStart: '',
    eventEnd: '',
    eventThumbnailUrl: '',
    movieId: '',
    maxWinners: '',
  });

  const [viewStatus, setViewStatus] = useState('진행중');
  const [events, setEvents] = useState([]);
  const [winners, setWinners] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get('/api/users/me', { withCredentials: true })
      .then((res) => setIsAdmin(res.data.role === 'ADMIN'))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchEventsByStatus(viewStatus);
    }
  }, [isAdmin, viewStatus]);

  const fetchEventsByStatus = (status) => {
    axios
      .get('/api/event/info', { params: { status } })
      .then((res) => setEvents(res.data))
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        alert(`${status} 이벤트 불러오기 실패: ${msg}`);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['movieId', 'maxWinners'];
    setForm({
      ...form,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleRegister = () => {
    axios
      .post('/api/event/register', form)
      .then(() => {
        alert('이벤트 등록 완료');
        fetchEventsByStatus(viewStatus);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        alert('이벤트 등록 실패: ' + msg);
      });
  };

  const handleDelete = (eventId) => {
    if (window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      axios
        .delete(`/api/event/delete/${eventId}`)
        .then(() => {
          alert('삭제 완료');
          setEvents((prev) => prev.filter((ev) => ev.eventId !== eventId));
        })
        .catch((err) => {
          const msg = err.response?.data?.message || err.message;
          alert('삭제 실패: ' + msg);
        });
    }
  };

  const handleSelectWinners = (eventId) => {
    axios
      .post(`/api/event/select/${eventId}`)
      .then(() => {
        alert('당첨자 선정 완료');
        fetchEventsByStatus(viewStatus);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        alert('당첨자 선정 실패: ' + msg);
      });
  };

  const handleViewWinners = (eventId) => {
    axios
      .get(`/api/event/winners/${eventId}`)
      .then((res) =>
        setWinners((prev) => ({
          ...prev,
          [eventId]: res.data,
        }))
      )
      .catch(() => alert('당첨자 조회 실패'));
  };

  if (!isAdmin) return null;

  return (
    <div>
      <Header />
      <div className="admin-event-container">
        <button className="back-button" onClick={() => navigate('/admin')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>이벤트 관리</h2>

        <div className="event-register-form">
          <h3>이벤트 등록</h3>
          <input type="text" name="eventName" placeholder="이벤트명" onChange={handleChange} />
          <input type="date" name="eventStart" onChange={handleChange} />
          <input type="date" name="eventEnd" onChange={handleChange} />
          <input type="text" name="eventThumbnailUrl" placeholder="썸네일 URL" onChange={handleChange} />
          <input type="number" name="movieId" placeholder="영화 ID" onChange={handleChange} />
          <input type="number" name="maxWinners" placeholder="당첨자 수" onChange={handleChange} />
          <button onClick={handleRegister}>등록하기</button>
        </div>

        <div className="event-status-buttons">
          <button onClick={() => setViewStatus('진행중')}>진행중인 이벤트 </button>
          <button onClick={() => setViewStatus('종료')}>종료된 이벤트</button>
        </div>

        <h3>{viewStatus === '진행중' ? '진행중인 이벤트' : '종료된 이벤트'}</h3>
        <div className="event-list">
          {events.map((ev) => (
            <div key={ev.eventId} className="event-card">
              <img src={ev.eventThumbnailUrl || '/default-thumbnail.png'} alt={ev.eventName} />
              <div>{ev.eventName}</div>
              <div>{ev.eventStart} ~ {ev.eventEnd}</div>

              {viewStatus === '진행중' ? (
                <button onClick={() => handleDelete(ev.eventId)}>삭제</button>
              ) : (
                <>
                  <button onClick={() => handleSelectWinners(ev.eventId)}>당첨자 선정</button>
                  <button onClick={() => handleViewWinners(ev.eventId)}>당첨자 보기</button>
                  {winners[ev.eventId] && (
                    <ul className="winner-list">
                      {winners[ev.eventId].map((w) => (
                        <li key={w.userId}>{w.userName} ({w.userEmail})</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminEventPage;
