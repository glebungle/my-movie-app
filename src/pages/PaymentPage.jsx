import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import Header from '../components/Header';
import './PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, lockDetails, scheduleId } = location.state;

  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [selectedCouponRate, setSelectedCouponRate] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('카드');

  const [availablePoint, setAvailablePoint] = useState(0);
  const [pointToUse, setPointToUse] = useState(0);

  const totalOriginalPrice = lockDetails.reduce((sum, l) => sum + l.price, 0);
  const discountAmount = Math.floor(totalOriginalPrice * selectedCouponRate);
  const afterCouponPrice = totalOriginalPrice - discountAmount;
  const finalPrice = afterCouponPrice - pointToUse;

  useEffect(() => {
    axios.get(`/api/users/${userId}/coupons`)
      .then(res => setCoupons(res.data))
      .catch(() => setCoupons([]));

    axios.get(`/api/users/${userId}`)
      .then(res => setAvailablePoint(res.data.availablePoint || 0))
      .catch(() => setAvailablePoint(0));
  }, [userId]);

  const handleCouponChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === 'none') {
      setSelectedCouponId(null);
      setSelectedCouponRate(0);
    } else {
      const coupon = coupons.find(c => String(c.couponUserId) === selectedId);
      setSelectedCouponId(coupon.couponUserId);
      setSelectedCouponRate(parseFloat(coupon.discountRate));
    }
  };

  const handlePay = () => {
    if (pointToUse < 0) {
      alert('사용할 포인트는 0 이상이어야 합니다.');
      return;
    }

    if (pointToUse > availablePoint) {
      alert('보유 포인트를 초과하여 사용할 수 없습니다.');
      return;
    }

    if (finalPrice < 0) {
      alert('쿠폰과 포인트 적용 후 결제 금액이 0보다 작을 수 없습니다.');
      return;
    }

    const body = {
      paymentMethod,
      usePoint: pointToUse,
      details: lockDetails.map(lock => ({
        lockId: lock.lockId,
        ...(selectedCouponId && { couponUserId: selectedCouponId }),
      })),
    };

    axios.post('/api/payments', body)
      .then(res => {
        if (res.data.success) {
          alert('결제가 완료되었습니다!');
          navigate('/');
        } else {
          alert(`결제 실패: ${res.data.message}`);
        }
      })
      .catch(err => {
        console.error(err);
        alert('서버 오류로 결제에 실패했습니다.');
      });
  };

  return (
    <div>
      <Header />
      <div className="payment-page">
        <h2>결제 정보 확인</h2>

        <div className="payment-section">
          <p>총 금액: {totalOriginalPrice.toLocaleString()}원</p>

          <div className="coupon-section">
            <label>쿠폰 선택: </label>
            <select value={selectedCouponId || 'none'} onChange={handleCouponChange}>
              <option value="none">쿠폰 없음</option>
              {coupons.map((coupon) => (
                <option key={coupon.couponUserId} value={coupon.couponUserId}>
                  {coupon.couponName} ({(parseFloat(coupon.discountRate) * 100).toFixed(0)}% 할인)
                </option>
              ))}
            </select>
          </div>

          <div className="point-section">
            <label>포인트 사용: </label>
            <input
              type="number"
              min="0"
              max={availablePoint}
              value={pointToUse}
              onChange={(e) => setPointToUse(parseInt(e.target.value) || 0)}
              placeholder="사용할 포인트"
            />
            <p className="available-point">보유 포인트: {availablePoint.toLocaleString()}P</p>
          </div>

          <p>할인 금액: -{discountAmount.toLocaleString()}원</p>
          <p>포인트 사용: -{pointToUse.toLocaleString()}원</p>
          <h3>최종 결제금액: {finalPrice.toLocaleString()}원</h3>
        </div>

        <div className="payment-method">
          <label>결제 수단 선택: </label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="카드">카드</option>
            <option value="무통장입금">무통장입금</option>
            <option value="현금결제">현금결제</option>
          </select>
        </div>

        <div className="btn-group">
          <button onClick={() => navigate(-1)}>뒤로가기</button>
          <button onClick={handlePay}>결제하기</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default PaymentPage;
