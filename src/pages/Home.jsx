import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import './Home.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('SHOWING');
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventPage, setEventPage] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();
  const eventPageSize = 3; 



  const fetchMovies = async (status) => {
    try {
      const res = await axios.get(`/api/movies/simple`, {
        params: { status },
      });
      setMovies(res.data);
      setCurrentPage(0);
    } catch (error) {
      console.error('영화 목록 불러오기 실패:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`/api/event/info`, {
        params: { status: '진행중' },
      });
      setEvents(res.data);
      setEventPage(0);
    } catch (error) {
      console.error('이벤트 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchMovies(status);
    fetchEvents();
  }, [status]);

  const totalPages = Math.ceil(movies.length / pageSize);
  const currentMovies = movies.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const totalEventPages = Math.ceil(events.length / eventPageSize);
  const currentEvents = events.slice(eventPage * eventPageSize, (eventPage + 1) * eventPageSize);
  return (
    <div>
      <Header />
      <section className="banner">
        <img src="/banner.png" alt="Movie Banner" className="movie-banner-image" />
      </section>

      <div className="home-movie-section">
        <div className="movie-section-header">
          <div className="status-toggle">
            <button className={status === 'SHOWING' ? 'active' : ''} onClick={() => setStatus('SHOWING')}>
              현재 상영작
            </button>
            <button className={status === 'UPCOMING' ? 'active' : ''} onClick={() => setStatus('UPCOMING')}>
              상영 예정작
            </button>
          </div>
          <button className="view-all-btn" onClick={() => navigate('/movies')}>전체보기</button>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>
            <img src="/arrow-L.png" alt="◀" className="left-arrow-icon" />
          </button>

          <div className="carousel-list">
            {currentMovies.map(movie => (
              <div key={movie.movieId} className="movie-card">
                <Link to={`/movies/${movie.movieId}`} state={{ thumbnailUrl: movie.thumbnailUrl }}>
                  <img src={movie.thumbnailUrl} alt={movie.title} />
                </Link>
                <p className="title">{movie.title}</p>
                <div className="info-line">
                  <span className="rating-line"><span>평점</span><span>{movie.likeRating?.toFixed(1) ?? 0}</span></span>
                  <span className="audience-line"><span>관객수</span><span>{movie.totalAudience ?? 0}</span></span>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-arrow right" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} disabled={currentPage >= totalPages - 1}>
            <img src="/arrow-R.png" alt="▶" className="right-arrow-icon" />
          </button>
        </div>
      </div>

      <div className="event-section">
        <div className="event-section-header">
          <h2 className="section-title">EVENT</h2>
          <button className="view-all-btn2" onClick={() => navigate('/events')}>전체보기</button>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={() => setEventPage(p => Math.max(p - 1, 0))} disabled={eventPage === 0}>
            <img src="/arrow-L.png" alt="◀" className="left-arrow-icon" />
          </button>

          <div className="carousel-list event-carousel-list">
            {currentEvents.map(event => (
              <div key={event.eventId} className="home-event-card">
                <img src={event.eventThumbnailUrl || '/default-thumbnail.png'} alt={event.eventName} />
              </div>
            ))}
          </div>

          <button className="carousel-arrow right" onClick={() => setEventPage(p => Math.min(p + 1, totalEventPages - 1))} disabled={eventPage >= totalEventPages - 1}>
            <img src="/arrow-R.png" alt="▶" className="right-arrow-icon" />
          </button>
        </div>
      </div>


      <Footer />
    </div>
  );
}

export default Home;
