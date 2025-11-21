import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import Header from '../components/Header';

function Admin() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="admin-container">
        <h1 className="admin-title">관리자 메뉴</h1>
        <div className="admin-grid">
          <div className="admin-card" onClick={() => navigate('/admin/coupons')}>
            <h2>쿠폰 발행</h2>
            <p>회원에게 제공할 쿠폰을 생성합니다.</p>
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/movies')}>
            <h2>영화 관리</h2>
            <p>상영할 영화 정보를 등록하고 수정합니다.</p>
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/screens')}>
            <h2>상영관 관리</h2>
            <p>상영관 정보를 생성하고 좌석 배치를 설정합니다.</p>
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/schedules')}>
            <h2>상영 일정 관리</h2>
            <p>영화의 상영 일정을 설정합니다.</p>
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/events')}>
            <h2>이벤트 관리</h2>
            <p>이벤트를 등록하고 삭제합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
