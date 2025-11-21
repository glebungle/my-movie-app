import './SignUp.css';
import { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  });
  const [showRejoinModal, setShowRejoinModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/users/signup', {
        nickname: form.nickname,
        email: form.email,
        password: form.password,
        birthDate: form.birthDate
      });

      alert('회원가입 성공!');
      navigate('/signin');
    } catch (error) {
      const message = error.response?.data?.message || '';
      if (message.includes('탈퇴한 계정')) {
        setShowRejoinModal(true);
      } else {
        alert('회원가입 실패: ' + message);
      }
    }
  };


  return (
    <div>
      <Header />
      <div className="signup-container">
        <div className="signup-box">
          <label>닉네임</label>
          <input
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요."
          />

          <label>이메일</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요."
          />

          <label>비밀번호</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요."
          />

          <label>비밀번호 확인</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 한번 더 입력하세요."
          />

          <label>생년월일</label>
          <input
            name="birthDate"
            type="text"
            value={form.birthDate}
            onChange={handleChange}
            placeholder="생년월일을 입력하세요.(YYYY-MM-DD)"
          />

          <button className="signup-btn" onClick={handleSubmit}>회원가입</button>

          <p className="rejoin-link">
              <a href="/rejoin">계정 복구</a>
            </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default SignUp;
