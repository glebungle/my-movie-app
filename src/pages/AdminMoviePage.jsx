import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import './AdminMoviePage.css';

function AdminMoviePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [movie, setMovie] = useState({
    title: '',
    thumbnailUrl: '',
    runningTime: '',
    releaseDate: '',
    ageRating: '',
    description: '',
    genre: '',
    director: '',
    actors: '',
    trailerUrl: '',
    stillCutUrl: '',
  });
  const [movieId, setMovieId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => setIsAdmin(res.data.role === 'ADMIN'))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post('/api/movies/create', movie);
      setMessage('영화가 성공적으로 등록되었습니다.');
    } catch (error) {
      setMessage('영화 등록 실패: ' + (error.response?.data?.message || '오류 발생'));
    }
  };

  const handleUpdate = async () => {
    if (!movieId) {
      setMessage('영화 ID를 입력해주세요.');
      return;
    }
    try {
      const res = await axios.put(`/api/movies/${movieId}/update`, movie);
      setMessage('영화 정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      setMessage('영화 수정 실패: ' + (error.response?.data?.message || '오류 발생'));
    }
  };

  if (!isAdmin) return <div style={{ padding: '2rem' }}>관리자만 접근 가능합니다.</div>;

  return (
    <div>
      <Header />
      <div className='admin-movie-container'>
        <div style={{ padding: '2rem' }}>
          <button className="back-button" onClick={() => navigate('/admin')}>
            <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
          </button>
          <h2>영화 등록 / 수정</h2>

          {Object.keys(movie).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key}
              value={movie[key]}
              onChange={handleChange}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
          ))}

          <button onClick={handleCreate}>영화 등록</button>

          <hr />

          <h3>영화 수정</h3>
          <input
            type="number"
            placeholder="영화 ID (수정용)"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <button onClick={handleUpdate}>영화 정보 수정</button>

          <hr />
          <p>{message}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminMoviePage;
