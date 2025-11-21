import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import './MyPage.css';
import Header from '../components/Header';

function MyPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true });
        const userId = res.data.userId;
        setIsLoggedIn(true);

        const detailRes = await axios.get(`/api/users/${userId}`);
        setUserInfo(detailRes.data);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return (
    <div>
      <Header />
      <div className="mypage-container">
        {loading ? (
          null
        ) : isLoggedIn && userInfo ? (
          <>
            <div className="profile-section">
              <div className="profile-info">
                <div className="profile-icon">👤</div>
                <div className="user-text">
                  <div className="user-name">
                    <b>{userInfo.nickname}</b>님
                  </div>
                  <div className="user-point">
                    보유 포인트: {userInfo.availablePoint.toLocaleString()}P
                  </div>
                </div>
              </div>
              <button className="edit-button" onClick={() => navigate('/update')}>
                ✎
              </button>
            </div>

            <div className="menu-buttons">
              <div className="menu-btn-group1">
                <button className="menu-btn outline" onClick={() => navigate('/reservation/history')}>
                  예매내역
                </button>
                <button className="menu-btn outline" onClick={() => navigate('/myevent')}>
                  이벤트 응모 내역
                </button>
              </div>
              <div className="menu-btn-group2">
                <button className="menu-btn colored" onClick={() => navigate('/myreview')}>
                  내 리뷰
                </button>
                <button className="menu-btn colored" onClick={() => navigate('/wishlist')}>
                  찜 목록
                </button>
              </div>
              <div className="menu-btn-group3">
                <button className="menu-btn filled" onClick={() => navigate('/coupons')}>
                  쿠폰함
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>비회원은 이용이 불가능합니다.</p>
            <p>
              <Link to="/signin">로그인</Link> / <Link to="/signup">회원가입</Link>
            </p>
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default MyPage;
