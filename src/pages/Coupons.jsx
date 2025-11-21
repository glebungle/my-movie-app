import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Coupons.css';

function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        const uid = userRes.data.userId;
        setUserId(uid);

        const res = await axios.get(`/api/users/${uid}/coupons`);
        setCoupons(res.data);
      } catch (err) {
        console.error('쿠폰 조회 실패:', err);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div>
      <Header />
      <div className="coupon-container">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>보유 쿠폰</h2>
        <table className="coupon-table">
          <thead>
            <tr>
              <th>쿠폰 이름</th>
              <th>할인율</th>
              <th>유효기간</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={i}>
                <td>{c.couponName}</td>
                <td>{c.discountRate}</td>
                <td>{c.validUntil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
  );
}

export default Coupon;
