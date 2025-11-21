import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewRegister.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ReviewRegister() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(0);
  const [context, setContext] = useState('');
  const [eligible, setEligible] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => {
        const uid = res.data.userId;
        setUserId(uid);
        checkEligibility(uid);
      })
      .catch(() => {
        alert('로그인이 필요합니다.');
        navigate('/signin');
      });
  }, [movieId]);

  const checkEligibility = async (uid) => {
    try {
      const now = new Date();

      // 1. 예매 내역 확인
      const reservationsRes = await axios.get(`/api/reservations/history/${uid}`);
      const watchedReservation = reservationsRes.data.find(r =>
        r.movieId === Number(movieId) &&
        r.status === 'CONFIRMED' &&
        new Date(r.startTime) < now // ✅ 상영이 끝난 경우만
      );

      if (!watchedReservation) {
        setEligible(false);
        return;
      }
      setEligible(true);
      

      // 2. 리뷰 작성 여부 확인
      const reviewRes = await axios.get(`/api/reviews/user/${uid}`);
      const reviewedMovieIds = reviewRes.data.map(r => r.movieId);
      if (reviewedMovieIds.includes(Number(movieId))) {
        setAlreadyReviewed(true);
      }
    } catch (err) {
      console.error('자격 확인 중 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (rating < 0 || rating > 5) return alert("0 ~ 5점 사이로 입력해주세요.");
    if (!context.trim()) return alert("리뷰 내용을 입력해주세요.");

    axios.post('/api/reviews', {
      userId,
      movieId: Number(movieId),
      rating,
      context
    })
      .then(() => {
        alert('리뷰가 등록되었습니다.');
        navigate(`/movies/${movieId}`);
      })
      .catch(() => alert('리뷰 등록 중 오류 발생'));
  };

  return (
    <div>
      <Header />
      <div className='entire-container'>
        <div className="review-container">
          <h2>영화 평점 및 리뷰 등록</h2>

          {isLoading ? (
            <p className="review-message">정보를 불러오는 중입니다...</p>
          ) : !eligible ? (
            <p className="review-message">예매한 영화의 상영이 시작된 이후에만 리뷰를 작성할 수 있습니다.</p>
          ) : alreadyReviewed ? (
            <p className="review-message">이미 이 영화에 리뷰를 남기셨습니다.</p>
          ) : (
            <>
              <div className='review-boxes'>
                <div className='starpoint'>
                  <label>평점</label>
                  <input
                    type="number"
                    value={rating}
                    min="0"
                    max="5"
                    step="0.1"
                    onChange={e => setRating(parseFloat(e.target.value))}
                  />
                </div>
                <div className='review-contents'>
                  <input
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    placeholder="이 영화에 대한 리뷰를 작성해주세요."
                  />
                </div>
              </div>
              <div className="review-button-group">
                <button className="review-register-btn" onClick={handleSubmit}>등록</button>
                <button className="review-cancel-btn" onClick={() => navigate(-1)}>취소</button>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ReviewRegister;
