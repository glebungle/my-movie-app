import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/users/me', {
          withCredentials: true
        });
        setIsLoggedIn(true);
        setNickname(res.data.nickname);
        setUserId(res.data.userId);
        setRole(res.data.role);
      } catch {
        setIsLoggedIn(false);
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/users/logout', {}, {
        withCredentials: true
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch {
      alert('로그아웃 실패');
    }
  };

  const handleWithdraw = () => {
    setPasswordInput('');
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async () => {
    try {
      await axios.post(`http://localhost:8080/api/users/${userId}/check-password`, {
        currentPassword: passwordInput
      }, {
        withCredentials: true
      });

      await axios.delete(`http://localhost:8080/api/users/${userId}/withdraw`, {
        withCredentials: true
      });

      await axios.post('http://localhost:8080/api/users/logout', {}, {
        withCredentials: true
      });

      alert('회원 탈퇴가 완료되었습니다.');
      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('비밀번호가 틀렸습니다.');
      } else {
        alert('회원 탈퇴 실패');
      }
    } finally {
      setShowWithdrawModal(false);
    }
  };

  const handleSearch = () => {
    if (keyword.trim() !== '') {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <header className="header">
        <div onClick={() => navigate('/')} className="logo">CINEFLEX</div>

        <nav className="nav-center">
          <Link to="/movies" className={isActive('/movies') ? 'active' : ''}>영화</Link>
          <Link to="/reservation" className={isActive('/reservation') ? 'active' : ''}>예매</Link>
          <Link to="/events" className={isActive('/events') ? 'active' : ''}>이벤트</Link>
        </nav>

        <div className="nav-right">
          <input
            type="text"
            className="search-input"
            placeholder="영화 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}><img src="/search.png" alt="검색" className="search-icon"/></button>
          {isLoggedIn ? (
            <>
              <span>{nickname}님 환영합니다</span>
              {role === 'ADMIN' ? (
                <button onClick={() => navigate('/admin')}>관리자</button>
              ) : (
                <button onClick={() => navigate('/mypage')}>마이페이지</button>
              )}
              <button onClick={handleLogout}>로그아웃</button>
              <button onClick={handleWithdraw}>회원탈퇴</button>
            </>
          ) : (
            <>
              <Link to="/signin">로그인</Link> / <Link to="/signup">회원가입</Link>
            </>
          )}
        </div>
      </header>

      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>회원 탈퇴 확인</h3>
            <label>비밀번호를 입력해주세요</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
            />
            <div className="modal-buttons">
              <button className="withdraw-confirm-btn" onClick={confirmWithdraw}>확인</button>
              <button className="cancel-btn" onClick={() => setShowWithdrawModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
