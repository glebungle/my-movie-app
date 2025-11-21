import './SignIn.css';
import { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';


function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', form, {
        withCredentials: true 
      });
      alert(`환영합니다, ${res.data.nickname}님!`);
      navigate('/');
    } catch (error) {
      alert('로그인 실패: ' + (error.response?.data?.message || error.message || '서버 에러'));
    }
  };

  return (
    <div>
      <Header />
      <div className="signin-container">
        <div className="signin-box">
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

          <button className="signin-btn" onClick={handleLogin}>로그인</button>

          <p className="signup-link">
              아직 회원이 아니신가요? <a href="/signup">가입하기</a>
            </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default SignIn;
