// Rejoin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Rejoin.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Rejoin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRejoin = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/users/rejoin', {
        email,
        password
      });
      alert('계정이 복구되었습니다. 로그인해주세요.');
      navigate('/signin');
    } catch (err) {
      alert('재가입 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Header />
      <div className="rejoin-container">
        <div className="rejoin-box">
          <div className='rejoin-textwrap'>
            <h2>계정 복구</h2>
            <p>탈퇴했던 계정을 복구하시려면 아래 정보를 입력해주세요.</p>
          </div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
          />

          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
          />

          <button className="rejoin-btn" onClick={handleRejoin}>계정 복구하기</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Rejoin;
