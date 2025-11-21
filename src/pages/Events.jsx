import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import './Events.css';

function EventsPage() {
  const [status, setStatus] = useState('진행중');
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => setUserId(res.data.userId))
      .catch(() => setUserId(null));
  }, []);

  const fetchEvents = async (status) => {
    try {
      const res = await axios.get('/api/event/info', { params: { status } });
      setEvents(res.data);
    } catch (error) {
      console.error('이벤트 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchEvents(status);
  }, [status]);

  const handleApply = async (eventId) => {
    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    try {
      const res = await axios.post('/api/event/apply', {
        eventId,
        userId,
      });

      if (res.data.success) {
        alert('이벤트 응모가 완료되었습니다!');
      } else {
        alert(`응모 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('응모 요청 실패:', err);
      alert('서버 오류로 응모에 실패했습니다.');
    }
  };

  return (
    <div>
      <Header />
      <section className="event-banner">
        <img
          src="/eventbanner.png"
          alt="Event Banner"
          className="event-banner-image"
        />
      </section>
      <div className="events-container">
        <div className="status-section">
          <div className="status-toggle">
            <button
              className={status === '진행중' ? 'active' : ''}
              onClick={() => setStatus('진행중')}
            >
              진행중인 이벤트
            </button>
            <button
              className={status === '종료' ? 'active' : ''}
              onClick={() => setStatus('종료')}
            >
              종료된 이벤트
            </button>
          </div>

          <div className="events-list-wrapper">
            <div className="events-list">
              {events.length === 0 ? (
                <p className="no-events-message">이벤트가 없습니다</p>
              ) : (
                events.map(event => (
                  <div key={event.eventId} className="events-card">
                    <img src={event.eventThumbnailUrl || '/default-thumbnail.png'} alt={event.eventName} />
                    <p className="events-title">{event.eventName}</p>
                    <div className="events-info-line">
                      <span>{event.eventStart} ~ {event.eventEnd}</span>
                    </div>
                    {status === '진행중' && (
                      <button className="events-apply" onClick={() => handleApply(event.eventId)}>
                        이벤트 응모하기
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default EventsPage;
