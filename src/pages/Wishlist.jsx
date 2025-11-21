import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Wishlist.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
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

    axios.get(`/api/wishlist/${userId}`)
      .then(res => setWishlist(res.data))
      .catch(err => console.error("위시리스트 조회 실패", err));
  }, [userId]);

  const handleRemove = (movieId) => {
    if (!window.confirm("영화를 찜 목록에서 삭제하시겠습니까?")) return;

    axios.delete(`/api/wishlist/cancel`, {
      params: { userId, movieId }
    })
      .then(() => {
        setWishlist(prev => prev.filter(m => m.movieId !== movieId));
      })
      .catch(err => alert("삭제 실패: " + err.response?.data || err.message));
  };

  return (
    <div>
      <Header />
      <div className="wishlist-page">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>내가 찜한 영화</h2>
        {wishlist.length === 0 ? (
          <p className="empty-message">찜한 영화가 없습니다.</p>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((movie) => (
              <div key={movie.movieId} className="wishlist-card">
                <Link to={`/movies/${movie.movieId}`} state={{ thumbnailUrl: movie.thumbnailUrl }}>
                  <img src={movie.thumbnailUrl} alt={movie.title} className="wishlist-thumb"/>
                </Link>
                <div className="wishlist-title">
                  <h3>{movie.title}</h3>
                  <button className="remove-btn" onClick={() => handleRemove(movie.movieId)}>찜 취소</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default Wishlist;
