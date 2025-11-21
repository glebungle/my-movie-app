import React, { useEffect, useState } from 'react';
import { fetchSchedulesByDate } from '../api/bookingApi';
import './ReservationPage.css';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

function ReservationPage() {
  const location = useLocation();
  const initialMovieTitle = location.state?.selectedMovieTitle || null;
  const [selectedMovie, setSelectedMovie] = useState(initialMovieTitle);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const options = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const day = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return { date: `${yyyy}-${mm}-${dd}`, day, month: `${parseInt(mm)}월` };
    });
    setDateOptions(options);

    const promises = options.map(opt =>
      fetchSchedulesByDate(opt.date).then(result =>
        result.map(sch => ({ ...sch, date: opt.date }))
      )
    );

    Promise.all(promises)
      .then(results => setSchedules(results.flat()))
      .catch(() => setSchedules([]));
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get('/api/movies/simple', { params: { status: 'SHOWING' } }),
      axios.get('/api/movies/simple', { params: { status: 'UPCOMING' } }),
    ]).then(([res1, res2]) => {
      const merged = [...res1.data, ...res2.data];
      setAllMovies(merged);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => res.data && setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleNextClick = () => {
    if (!selectedScheduleId) return;
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    navigate(`/reservation/seats/${selectedScheduleId}`, {
      state: { date: selectedDate }
    });
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate('/signin');
  };

  const sortedMovies = [...allMovies].sort((a, b) => {
    const aHas = selectedDate
      ? schedules.some(s => s.movieTitle === a.title && s.date === selectedDate)
      : schedules.some(s => s.movieTitle === a.title);
    const bHas = selectedDate
      ? schedules.some(s => s.movieTitle === b.title && s.date === selectedDate)
      : schedules.some(s => s.movieTitle === b.title);
    return aHas === bHas ? 0 : aHas ? -1 : 1;
  });

  const displaySchedules = selectedDate
    ? schedules.filter(s => (!selectedMovie || s.movieTitle === selectedMovie) && s.date === selectedDate)
    : [];

  const groupedByMovie = displaySchedules.reduce((acc, sch) => {
    if (!acc[sch.movieTitle]) acc[sch.movieTitle] = {};
    if (!acc[sch.movieTitle][sch.screenName]) acc[sch.movieTitle][sch.screenName] = [];
    acc[sch.movieTitle][sch.screenName].push(sch);
    return acc;
  }, {});

  const visibleDateOptions = dateOptions.slice(currentDateIndex, currentDateIndex + 5);

  return (
    <div>
      <Header />
      <div className="reservation-page">
        <aside className="reservation-movie-list">
          <div className="reservation-movie-list-header">영화</div>
          {sortedMovies.map((movie, idx) => {
            const dimmed = selectedDate
              ? !schedules.some(s => s.movieTitle === movie.title && s.date === selectedDate)
              : !schedules.some(s => s.movieTitle === movie.title);
            return (
              <div
                key={idx}
                className={`movie-item ${selectedMovie === movie.title ? 'selected' : ''} ${dimmed ? 'dimmed' : ''}`}
                onClick={() => !dimmed && setSelectedMovie(selectedMovie === movie.title ? null : movie.title)}
              >
                {movie.title}
              </div>
            );
          })}
        </aside>

        <main className="schedule-area">
          <div className="date-button-group">
            <button className="schedule-arrow-button" onClick={() => setCurrentDateIndex(i => Math.max(0, i - 1))} disabled={currentDateIndex === 0}><img src="/arrow-L.png" alt="◀" className="left-arrow-icon"/></button>
            {visibleDateOptions.map((opt, idx) => {
              const showMonth = idx === 0 || opt.month !== visibleDateOptions[idx - 1]?.month;
              const dimmed = selectedMovie
                ? !schedules.some(s => s.movieTitle === selectedMovie && s.date === opt.date)
                : !schedules.some(s => s.date === opt.date);
              return (
                <div key={idx} className="date-item">
                  {showMonth && <div className="month-label">{opt.month}</div>}
                  <button
                    className={`date-button ${selectedDate === opt.date ? 'selected' : ''} ${dimmed ? 'dimmed' : ''}`}
                    onClick={() => !dimmed && setSelectedDate(opt.date)}
                  >
                    <div className="date-number">{opt.date.slice(8, 10)}</div>
                    <div className="day-name">{opt.day}</div>
                  </button>
                </div>
              );
            })}
            <button className="schedule-arrow-button" onClick={() => setCurrentDateIndex(i => Math.min(dateOptions.length - 5, i + 1))} disabled={currentDateIndex >= dateOptions.length - 5}><img src="/arrow-R.png" alt="▶" className="right-arrow-icon"/></button>
          </div>

          <div className="schedule-board">
            {!selectedDate ? (
              <p className="reserve-empty-message">날짜를 선택하세요.</p>
            ) : displaySchedules.length === 0 ? (
              <p className="reserve-empty-message">해당 날짜에 스케줄이 없습니다.</p>
            ) : (
              Object.entries(groupedByMovie).map(([movieTitle, screens], idx) => (
                <div key={idx} className="movie-block">
                  <h3 className="movie-title">{movieTitle}</h3>
                  {Object.entries(screens).map(([screenName, screenings], i) => (
                    <div key={i} className="screen-block">
                      <h4 className="screen-title">{screenName}</h4>
                      <div className="screen-times">
                        {screenings.map((sch, j) => (
                          <div
                            key={j}
                            className={`time-button ${selectedScheduleId === sch.scheduleId ? 'selected-schedule' : ''}`}
                            onClick={() => setSelectedScheduleId(selectedScheduleId === sch.scheduleId ? null : sch.scheduleId)}
                          >
                            <div className="time">{sch.startTime.slice(11, 16)}</div>
                            <div className="seat-info">
                              <span className={sch.availableSeats > 0 ? 'seat-available' : 'seat-empty'}>
                                {sch.availableSeats}
                              </span>{' '} /<span>{sch.totalSeats}</span> 
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
          <div className="next-button-area">
              <button className="next-button" onClick={handleNextClick}>좌석선택</button>
            </div>
        </main>
      </div>
      <Footer/>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>비회원은 예매가 불가능합니다.</p>
            <button onClick={handleConfirmModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationPage;
