import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Movies.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('SHOWING');
  const [genre, setGenre] = useState('');
  const [ageRating, setAgeRating] = useState('');
  const [sort, setSort] = useState('latest');
  const [rawMovies, setRawMovies] = useState([]);

  const fetchMovies = async (targetStatus = status, customGenre = genre, customAge = ageRating) => {
    try {
      const res = await axios.get('/api/movies/simple', {
        params: {
          status: targetStatus,
          genre: customGenre || null,
          ageRating: customAge || null
        }
      });
      setRawMovies(res.data);
    } catch (error) {
      console.error('영화 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    let sorted = [...rawMovies];
    if (sort === 'latest') {
      sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sort === 'rating') {
      sorted.sort((a, b) => b.likeRating - a.likeRating);
    } else if (sort === 'audience') {
      sorted.sort((a, b) => b.totalAudience - a.totalAudience);
    }
    setMovies(sorted);
  }, [sort, rawMovies]);

  useEffect(() => {
    setGenre('');
    setAgeRating('');
    fetchMovies(status, '', '');
  }, [status]);

  const handleSearch = () => {
    fetchMovies(status, genre, ageRating);
  };

  return (
    <div>
      <Header />
      <div className="movie-section">
        <div className="status-toggle">
          <button className={status === 'SHOWING' ? 'active' : ''} onClick={() => setStatus('SHOWING')}>
            현재 상영작
          </button>
          <button className={status === 'UPCOMING' ? 'active' : ''} onClick={() => setStatus('UPCOMING')}>
            상영 예정작
          </button>
        </div>

        <div className="filter-bar">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">장르 선택</option>
            <option value="액션">액션</option>
            <option value="로맨스">로맨스</option>
            <option value="코미디">코미디</option>
            <option value="스릴러">스릴러</option>
            <option value="판타지">판타지</option>
          </select>

          <select value={ageRating} onChange={(e) => setAgeRating(e.target.value)}>
            <option value="">등급 선택</option>
            <option value="전체관람가">전체관람가</option>
            <option value="12세 이상">12세 이상</option>
            <option value="15세 이상">15세 이상</option>
            <option value="청소년 관람불가">청소년 관람불가</option>
          </select>

          <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>

        <div className="sort-options">
          <button className="sort-btn" onClick={() => setSort('latest')}>최신순</button>
          |
          <button className="sort-btn" onClick={() => setSort('rating')}>평점순</button>
          |
          <button className="sort-btn" onClick={() => setSort('audience')}>관람객순</button>
        </div>

        <div className="movie-list-wrapper">
          {movies.length === 0 ? (
            <div className="no-movie-msg">해당하는 영화가 없습니다.</div>
          ) : (
            <div className="movies-movie-list">
              {movies.map((movie) => (
                <div key={movie.movieId} className="movie-card">
                  <Link to={`/movies/${movie.movieId}`} state={{ thumbnailUrl: movie.thumbnailUrl }}>
                    <img src={movie.thumbnailUrl} alt={movie.title} />
                  </Link>
                  <p className="title">{movie.title}</p>
                  <div className="info-line">
                    <span className="rating-line"><span>평점</span><span>{movie.likeRating?.toFixed(1)}</span></span>
                    <span className="audience-line"><span>관객수</span><span>{movie.totalAudience?.toLocaleString()}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Movies;
