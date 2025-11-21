import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MyEvent.css';
import { useNavigate } from 'react-router-dom';

function MyEvent() {
  const [userId, setUserId] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const navigate = useNavigate();

  const statusMap = {
    APPLY: '응모완료',
    SELECTED: '당첨',
    NOT_SELECTED: '미당첨',
  };

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => {
        if (res.data?.userId) {
          setUserId(res.data.userId);
        }
      })
      .catch(err => console.error('유저 정보 조회 실패:', err));
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get(`/api/event/history/${userId}`)
      .then(res => setMyEvents(res.data))
      .catch(err => {
        console.error('이벤트 이력 조회 실패:', err);
        setMyEvents([]);
      });
  }, [userId]);

  return (
    <div>
      <Header />
      <div className="my-event-page">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>이벤트 응모 내역</h2>

        {myEvents.length === 0 ? (
          <p className="empty-message">응모한 이벤트가 없습니다.</p>
        ) : (
          <div className="event-grid">
            {myEvents.map((event, idx) => (
              <div key={idx} className="event-card">
                <img
                  src={event.eventThumbnailUrl || '/default-thumbnail.png'}
                  alt={event.eventName}
                  className="event-thumb"
                />
                <div className="event-info">
                  <h3>{event.eventName}</h3>
                  <p>{event.eventStart} ~ {event.eventEnd}</p>
                  <p>{statusMap[event.applyStatus] || '알 수 없음'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyEvent;
