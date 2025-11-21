import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SeatSelectionPage.css';

function SeatSelectionPage() {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedDate = location.state?.date;
  const [userId, setUserId] = useState(null);

  const [seats, setSeats] = useState([]);
  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [personCount, setPersonCount] = useState({ Adult: 0, Youth: 0, Senior: 0 });
  const [pricing, setPricing] = useState({ Adult: 0, Youth: 0, Senior: 0 });

  const totalCount = Object.values(personCount).reduce((a, b) => a + b, 0);

  const rowLabels = [...new Set(seats.map(s => s.rowNo))].sort();
  const maxColIndex = Math.max(...seats.map(s => s.colNo));

  useEffect(() => {
    axios.get('/api/users/me')
      .then(res => setUserId(res.data.userId))
      .catch(err => console.error('로그인 사용자 정보 조회 실패', err));
  }, []);

  useEffect(() => {
    axios.get(`/api/schedules/seats?schedule_id=${scheduleId}`)
      .then(res => {
        setSeats(res.data.seats);
        setPricing({
          Adult: res.data.adultPrice,
          Youth: res.data.youthPrice,
          Senior: res.data.seniorPrice
        });
      })
      .catch(err => console.error("좌석+가격 조회 실패:", err));

    if (passedDate) {
      axios.get(`/api/schedules?date=${passedDate}`)
        .then(res => {
          const allSchedules = res.data;
          const info = allSchedules.find(s => s.scheduleId === parseInt(scheduleId));
          setScheduleInfo(info);
        })
        .catch(err => console.error("스케줄 정보 실패:", err));
    }
  }, [scheduleId, passedDate]);

  const labelMap = {
    Adult: '성인',
    Youth: '청소년',
    Senior: '경로'
  };

  const handleSeatClick = (row, col, status) => {
    const id = `${row}-${col}`;
    if (status !== 'AVAILABLE') return;

    const isSelected = selectedSeats.some(seat => seat.id === id);
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(seat => seat.id !== id));
    } else {
      if (selectedSeats.length >= totalCount) return;
      setSelectedSeats(prev => [...prev, { id, rowNo: row, colNo: col }]);
    }
  };

  const expandedSeatsWithType = () => {
    const result = [];
    const counts = { ...personCount };
    for (let type of ['Adult', 'Youth', 'Senior']) {
      for (let i = 0; i < counts[type]; i++) {
        const seat = selectedSeats[result.length];
        if (seat) {
          result.push({ ...seat, userType: type });
        }
      }
    }
    return result;
  };

  const finalSeats = expandedSeatsWithType();
  const totalPrice = finalSeats.reduce((sum, seat) => sum + pricing[seat.userType], 0);

  const handlePayment = async () => {
    if (!userId) {
      alert('로그인 정보가 확인되지 않았습니다. 다시 시도해 주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/reservations/select-seats', {
        scheduleId: parseInt(scheduleId),
        userId: userId,
        seats: finalSeats
      });

      if (response.data.success) {
        navigate('/payment', {
          state: {
            userId,
            scheduleId,
            selectedSeats,
            finalSeats,
            totalPrice,
            lockDetails: response.data.reservations
          }
        });
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("좌석 예약 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="seat-page">
        <div className="selection-header">
          <div className="person-type-selector">
            {['Adult', 'Youth', 'Senior'].map(type => (
              <div key={type}>
                <div>{labelMap[type]}</div>
                {[...Array(9).keys()].map(i => (
                  <button
                    key={i}
                    className={`person-btn ${personCount[type] === i ? 'active' : ''}`}
                    onClick={() => {
                      const newCount = { ...personCount, [type]: i };
                      const newTotal = Object.values(newCount).reduce((a, b) => a + b, 0);
                      if (selectedSeats.length > newTotal) {
                        alert('선택한 좌석이 예매 인원보다 많습니다.');
                        return;
                      }
                      setPersonCount(newCount);
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="schedule-info">
            {scheduleInfo && (
              <>
                <div>{scheduleInfo.screenName} / {scheduleInfo.movieTitle}</div>
                <div className="bold">
                  {scheduleInfo.startTime.slice(0, 10)} (
                  {['일', '월', '화', '수', '목', '금', '토'][new Date(scheduleInfo.startTime).getDay()]})
                  {scheduleInfo.startTime.slice(11, 16)}~{scheduleInfo.endTime.slice(11, 16)}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="screen">SCREEN</div>

        <div className="seat-grid">
          {rowLabels.map(row => (
            <div key={row} className="seat-row">
              {Array.from({ length: maxColIndex }).map((_, idx) => {
                const col = idx + 1;
                const seat = seats.find(s => s.rowNo === row && s.colNo === col);
                const id = seat ? `${seat.rowNo}-${seat.colNo}` : `EMPTY-${row}-${col}`;
                const isSelected = seat && selectedSeats.some(s => s.id === id);

                return (
                  <div
                    key={id}
                    className={`seat ${seat ? '' : 'empty'}
                                ${seat && seat.status !== 'AVAILABLE' ? 'unavailable' : ''}
                                ${isSelected ? 'selected' : ''}`}
                    onClick={() => seat && handleSeatClick(row, col, seat.status)}
                  >
                    {seat ? `${seat.rowNo}${seat.colNo}` : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bottom-panel">
          <div className="seat-summary">
            <div>좌석 번호: {selectedSeats.map(seat => `${seat.rowNo}${seat.colNo}`).join(', ') || ''}</div>
            <div>
              {(() => {
                const grouped = finalSeats.reduce((acc, seat) => {
                  const type = seat.userType;
                  acc[type] = acc[type] ? { count: acc[type].count + 1, price: pricing[type] } : { count: 1, price: pricing[type] };
                  return acc;
                }, {});
                return Object.entries(grouped).map(([type, info]) => (
                  <div key={type}>
                    {labelMap[type]} {info.price.toLocaleString()}원 X {info.count}
                  </div>
                ));
              })()}
              <div className="total-price">
                총 금액 <b>{totalPrice.toLocaleString()}원</b>
              </div>
            </div>
          </div>
          <div className="btn-group">
            <button className="back-btn" onClick={() => navigate(-1)}>뒤로가기</button>
            <button
              className="pay-btn"
              disabled={selectedSeats.length !== totalCount || totalCount === 0}
              onClick={handlePayment}
            >
              결제 선택
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default SeatSelectionPage;
