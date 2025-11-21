import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './SearchResultPage.css';
import Footer from '../components/Footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultPage() {
  const query = useQuery();
  const keyword = query.get('keyword');

  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    axios.get(`/api/movies/search?keyword=${encodeURIComponent(keyword)}`)
      .then(res => setAllResults(res.data))
      .catch(err => console.error('검색 실패:', err))
      .finally(() => setLoading(false));
  }, [keyword]);

  const showingNow = allResults.filter(movie => movie.status === 'SHOWING');

  return (
    <div>
      <Header />
      <div className="search-container">
        <h2>"{keyword}" 검색 결과</h2>
        {loading ? (
          <p>검색 중...</p>
        ) : allResults.length === 0 ? (
          <p className='none-search'>검색 결과가 없습니다.</p>
        ) : (
          <>
            {showingNow.length > 0 && (
              <div className="search-section">
                <h3>지금 예매 가능한 영화</h3>
                <div className='search-movie-list-wrapper'>
                  <div className="search-movie-list">
                    {showingNow.map(movie => (
                      <div key={movie.movieId} className="movie-card">
                        <Link
                            to={`/movies/${movie.movieId}`}
                            state={{ thumbnailUrl: movie.thumbnailUrl }} 
                          >
                            <img src={movie.thumbnailUrl} alt={movie.title} />
                          </Link>
                        <p className="title">{movie.title}</p>
                        <div className="info-line">
                          <span className="rating-line">
                            <span>평점</span>
                            <span>{movie.likeRating ?? 0}</span>
                          </span>
                          <span className="audience-line">
                            <span>관객수</span>
                            <span>{movie.totalAudience ?? 0}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="search-section">
              <h3>전체 검색 결과 {allResults.length}건</h3>
              <div className='search-movie-list-wrapper'>
                <div className="search-movie-list">
                  {allResults.map(movie => (
                    <div key={movie.movieId} className="movie-card">
                        <Link
                            to={`/movies/${movie.movieId}`}
                            state={{ thumbnailUrl: movie.thumbnailUrl }} 
                          >
                            <img src={movie.thumbnailUrl} alt={movie.title} />
                          </Link>
                        <p className="title">{movie.title}</p>
                        <div className="info-line">
                          <span className="rating-line">
                            <span>평점</span>
                            <span>{movie.likeRating ?? 0}</span>
                          </span>
                          <span className="audience-line">
                            <span>관객수</span>
                            <span>{movie.totalAudience ?? 0}</span>
                          </span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default SearchResultPage;
