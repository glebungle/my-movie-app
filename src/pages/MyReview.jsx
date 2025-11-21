import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header';
import './MyReview.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function MyReview() {
  const [userId, setUserId] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => {
        if (res.data && res.data.userId) {
          setUserId(res.data.userId);
        }
      })
      .catch(err => console.error("로그인 정보 확인 실패", err));
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get(`/api/reviews/user/${userId}`)
      .then(res => setMyReviews(res.data))
      .catch(err => console.error("리뷰 조회 실패", err));
  }, [userId]);

  const [movieInfoMap, setMovieInfoMap] = useState({});

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieIds = myReviews.map(r => r.movieId);
      const uniqueIds = [...new Set(movieIds)];

      const promises = uniqueIds.map(id =>
        axios.get(`/api/movies/${id}`)
          .then(res => ({ id, data: res.data }))
          .catch(() => null)
      );

      const results = await Promise.all(promises);
      const infoMap = {};
      results.forEach(result => {
        if (result) infoMap[result.id] = result.data;
      });

      setMovieInfoMap(infoMap);
    };

    if (myReviews.length > 0) {
      fetchMovieDetails();
    }
  }, [myReviews]);

  return (
    <div>
      <Header />
      <div className="myreview-page">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>내가 남긴 리뷰</h2>
        {myReviews.length === 0 ? (
          <p className="empty-message">아직 작성한 리뷰가 없습니다.</p>
        ) : (
          <div className="myreview-grid">
            {myReviews.map((review, idx) => {
              const movie = movieInfoMap[review.movieId];
              return (
                <div key={idx} className="myreview-card">
                  {movie ? (
                    <Link to={`/movies/${review.movieId}`} state={{ thumbnailUrl: movie.thumbnailUrl }}>
                      <img src={movie.thumbnailUrl} alt={movie.title} className="myreview-thumb"/>
                    </Link>
                  ) : (
                    <div className="myreview-thumb loading">로딩 중...</div>
                  )}
                  <div className="myreview-title">
                    <h3>{movie?.title ?? '영화 정보 없음'}</h3>
                    <p>⭐ {review.rating.toFixed(1)}</p>
                    <p>{review.context}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default MyReview;
