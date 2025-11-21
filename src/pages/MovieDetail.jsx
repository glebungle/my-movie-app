import './MovieDetail.css';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function extractYoutubeId(url) {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}


function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isWished, setIsWished] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const thumbnailUrlFromHome = location.state?.thumbnailUrl;
  const [reviews, setReviews] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);


  useEffect(() => {
    if (!movieId) return;
    axios.get(`/api/reviews/movie/${movieId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("리뷰 로딩 실패", err));
  }, [movieId]);

  useEffect(() => {
  axios.get(`/api/movies/details/${movieId}`)
    .then(res => setMovieDetails(res.data))
    .catch(err => console.error("상세 영화 정보 로딩 실패", err));
}, [movieId]);

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => {
        if (res.data && res.data.userId) {
          setUserId(res.data.userId);
        }
      })
      .catch(err => console.error("로그인 정보 불러오기 실패", err));
  }, []);

  useEffect(() => {
    axios.get(`/api/movies/${movieId}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error("영화 정보 로딩 실패", err));
  }, [movieId]);

  useEffect(() => {
    if (!userId || !movieId) return;
    axios.get(`/api/wishlist/wishlist/check`, {
      params: { userId, movieId }
    })
      .then(res => setIsWished(res.data === 'yes'))
      .catch(err => console.error("찜 여부 확인 실패", err));
  }, [userId, movieId]);

  const toggleWishlist = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isWished) {
      axios.delete(`/api/wishlist/cancel`, {
        params: { userId, movieId }
      })
        .then(() => setIsWished(false))
        .catch(err => alert("찜 취소 실패: " + err.response?.data || err.message));
    } else {
      axios.post(`/api/wishlist`, { userId, movieId })
        .then(() => setIsWished(true))
        .catch(err => alert("찜 추가 실패: " + err.response?.data || err.message));
    }
  };

  if (!movie) return <div className="movie-detail">로딩 중...</div>;

  return (
    <div>
      <Header />
      <div className='detail-container'>
        <div className="movie-detail">
          <div className="movie-header">
            <img
              src={thumbnailUrlFromHome || movie.thumbnailUrl}
              alt={`${movie.title} 포스터`}
              className="poster"
            />
            <div className="movie-info">
              <h1>{movie.title} <span className="age">{movie.ageRating}</span></h1>
              <p>
                개봉 <strong>{movie.releaseDate}</strong>
                {" ⏱ "}{movie.runningTime}분
                {" 👥 "}{movie.totalAudience?.toLocaleString() || '0'}명
              </p>
              <p>평점 <strong>{movie.likeRating?.toFixed(1) || '0.0'}</strong></p>
              <div className="buttons">
                <button
                  className="reserve-btn"
                  onClick={() =>
                    navigate('/reservation', {
                      state: { selectedMovieTitle: movie.title }
                    })
                  }
                >
                  예매하기
                </button>
                <button
                  className="review-btn"
                  onClick={() => navigate(`/review/${movieId}`, { state: { userId } })}
                >
                  리뷰 등록
                </button>
                <button
                  className={`wishlist-btn ${isWished ? 'active' : ''}`}
                  onClick={toggleWishlist}
                >
                  {isWished ? <img src="/Heart.png" alt="위시리스트 등록" className="wishlist-icon"/> : 
                <img src="/BlankHeart.png" alt="위시리스트 취소" className="wishlist-icon"/>}
                </button>
              </div>
            </div>
          </div>
          <div className="movie-details">
            <h3>상세정보</h3>
            <p><strong>장르:</strong> {movieDetails?.genre ?? '정보 없음'}</p>
            <p><strong>감독:</strong> {movieDetails?.director ?? '정보 없음'}</p>
            <p><strong>출연진:</strong> {movieDetails?.actors ?? '정보 없음'}</p>
          </div>

          <div className="movie-preview">
            <h3>예고편</h3>
            {movieDetails?.trailerUrl ? (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${extractYoutubeId(movieDetails.trailerUrl)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>예고편이 없습니다.</p>
            )}
          </div>

          <div className="movie-stillcuts">
            <h3>스틸컷</h3>
            <div className="stillcut-gallery">
              <img src={movieDetails?.stillCutUrl || "/default-stillcut.jpg"} alt="스틸컷" />
            </div>
          </div>

          <div className="movie-reviews">
            <h3>관람평</h3>
            {reviews.length === 0 ? (
              <p>아직 등록된 리뷰가 없습니다.</p>
            ) : (
              <ul className="detail-review-list">
                {reviews.map((review, index) => (
                  <div key={index} className="detail-review-item">
                    <p><strong>⭐ {review.rating.toFixed(1)}</strong></p>
                    <p>{review.context}</p>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MovieDetail;
