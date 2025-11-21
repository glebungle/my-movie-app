import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './ReservationHistoryPage.css';

function ReservationHistoryPage() {
  const [userId, setUserId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [seatLocks, setSeatLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/users/me')
      .then(res => setUserId(res.data.userId))
      .catch(err => {
        console.error(err);
        setErrorMsg("로그인 정보를 불러오지 못했습니다.");
        setLoading(false);
      });
  }, []);

  const fetchReservations = () => {
    if (!userId) return;
    axios.get(`/api/reservations/history/${userId}`)
      .then(res => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("예매 내역을 불러오지 못했습니다.");
        setLoading(false);
      });
  };

  const fetchSeatLocks = () => {
    if (!userId) return;
    axios.get(`/api/seat-lock/user/${userId}`)
      .then(res => setSeatLocks(res.data))
      .catch(err => console.error("좌석 예약 목록 불러오기 실패", err));
  };

  useEffect(() => {
    fetchReservations();
    fetchSeatLocks();
  }, [userId]);

  const handleCancel = (reservationId) => {
    if (!window.confirm("정말로 예매를 취소하시겠습니까?")) return;
    axios.post('/payment/cancel', { reservationId })
      .then(res => {
        if (res.data.success) {
          alert('예매가 취소되었습니다.');
          fetchReservations();
        } else {
          alert(`취소 실패: ${res.data.message}`);
        }
      })
      .catch(err => {
        console.error(err);
        alert("서버 오류로 취소에 실패했습니다.");
      });
  };

  const handleContinuePayment = (lock) => {
    navigate('/payment', {
      state: {
        userId,
        scheduleId: lock.scheduleId,
        selectedSeats: [`${lock.rowNo}${lock.colNo}`],
        finalSeats: [{ rowNo: lock.rowNo, colNo: lock.colNo }],
        totalPrice: lock.price,
        lockDetails: [lock]
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="history-page">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>예매 내역</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : errorMsg ? (
          <p className="error">{errorMsg}</p>
        ) : (
          <>
            {seatLocks.length > 0 && (
              <div className="seat-lock-section">
                <h3>결제 대기</h3>
                <ul className="reservation-list">
                  {seatLocks.map((lock) => (
                    <li key={lock.lockId} className="reservation-item">
                      <div className="movie-title">{lock.movieTitle}</div>
                      <div className="info">
                        <span>{lock.screenName}</span>
                        <span>{new Date(lock.startTime).toLocaleString()}</span>
                      </div>
                      <div className="seat-info">좌석: {lock.rowNo}{lock.colNo}</div>
                      <div className="status pending">결제 대기 중 (~{new Date(lock.expiresAt).toLocaleTimeString()})</div>
                      <button className="continue-btn" onClick={() => handleContinuePayment(lock)}>
                        결제 계속하기
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <h3>예매 완료 및 취소 내역</h3>
            <p className='mini-alert'>*결제취소시 포인트가 부족할 경우, 환불액이 차감될 수 있습니다.</p>

            {reservations.length === 0 ? (
              <p className="no-reservation-message">예매 내역이 없습니다.</p>
            ) : (
              <ul className="reservation-list">
                {reservations.map((r) => {
                  const isBeforeStart = new Date(r.startTime) > new Date();
                  return (
                    <li key={r.reservationId} className="reservation-item">
                      <div className="movie-title">{r.movieTitle}</div>
                      <div className="info">
                        <span>{r.screenName}</span>
                        <span>{new Date(r.startTime).toLocaleString()}</span>
                      </div>
                      <div className="seat-info">좌석: {r.rowNo}{r.colNo}</div>
                      <div className={`status ${r.status.toLowerCase()}`}>
                        {r.status === 'CONFIRMED' ? '예매 완료' : '취소됨'}
                      </div>
                      {r.status === 'CONFIRMED' && (
                        <div className="button-group">
                          {isBeforeStart && (
                            <button className="cancel-btn" onClick={() => handleCancel(r.reservationId)}>
                              예매 취소
                            </button>
                          )}
                          <button
                            className="reserve-review-btn"
                            onClick={() => navigate(`/review/${r.movieId}`, { state: { userId } })}
                          >
                            리뷰 등록
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ReservationHistoryPage;
