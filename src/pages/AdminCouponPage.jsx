import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import './AdminCouponPage.css';
import { useNavigate } from 'react-router-dom';

function AdminCouponPage() {
  const [couponName, setCouponName] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true });
        if (res.data.role === 'ADMIN') setIsAdmin(true);
        else setIsAdmin(false);
      } catch {
        setIsAdmin(false);
      }
    };
    fetchSession();
  }, []);

  const handleIssue = async () => {
    if (!couponName) {
      alert('쿠폰 이름을 입력하세요.');
      return;
    }

    try {
      const res = await axios.post(`/api/coupons/issue/all`, null, {
        params: { couponName },
      });
      setMessage(res.data);
    } catch (err) {
      console.error(err);
      setMessage('발급 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  if (!isAdmin) return null;

  return (
    <div>
      <Header />
      <div className="admin-coupon-container">
        <button className="back-button" onClick={() => navigate('/admin')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>쿠폰 수동 발행</h2>
        <p>쿠폰 이름을 입력하면 전체 회원에게 발급됩니다.</p>

        <div className="issue-form">
          <label>쿠폰 이름 입력: </label>
          <input
            type="text"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
            placeholder="예: 10% 할인권"
          />
          <button onClick={handleIssue}>전체 회원에게 발급하기</button>
        </div>

        {message && <div className="result-message">{message}</div>}
      </div>
    </div>
  );
}

export default AdminCouponPage;
