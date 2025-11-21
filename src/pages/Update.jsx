import './Update.css';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Update() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true });
        const id = res.data.userId;
        setUserId(id);

        const detail = await axios.get(`/api/users/${id}`);
        setNickname(detail.data.nickname);
      } catch (err) {
        alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
        navigate('/signin');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!nickname.trim() || !password.trim()) {
      alert('닉네임과 비밀번호를 모두 입력해주세요.');
      return;
    }
    console.log("보내는 비밀번호:", password);
    try {
      await axios.post(`/api/users/${userId}/check-password`, {
        currentPassword: password 
      }, {
        withCredentials: true
      });

      await axios.put(`/api/users/${userId}`, {
        nickname: nickname,
        password: password
      }, {
        withCredentials: true
      });
      
      alert('닉네임이 성공적으로 변경되었습니다.');
      navigate('/mypage');
    } catch (err) {
      alert('수정 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Header />
      <div className="update-container">
        <div className="update-box">
          <h2>회원정보 수정</h2>

          <label>새 닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="변경할 닉네임"
          />

          <label>현재 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
          />

          <button className="update-btn" onClick={handleUpdate}>
            수정하기
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Update;
