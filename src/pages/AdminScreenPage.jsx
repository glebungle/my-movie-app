import React, { useState, useEffect } from 'react';
import { registerScreen, deleteScreen } from '../api/screenApi';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function AdminScreenPage() {
  const [screenName, setScreenName] = useState('');
  const [seats, setSeats] = useState([]);
  const [row, setRow] = useState('');
  const [col, setCol] = useState('');
  const [deleteName, setDeleteName] = useState('');
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

  const addSeat = () => {
    if (!row || !col) return;
    setSeats([...seats, { rowNo: row.toUpperCase(), colNo: parseInt(col)}]);
    setRow('');
    setCol('');
  };

  const handleRegister = async () => {
    try {
      console.log(screenName, seats);
      const response = await registerScreen(screenName, seats);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '등록 실패');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteScreen(deleteName);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '삭제 실패');
    }
  };

  if (!isAdmin) return <div style={{ padding: '2rem' }}>관리자만 접근 가능합니다.</div>;

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem' }}>
        <button className="back-button" onClick={() => navigate('/admin')}>
          <img src="/arrow.png" alt="뒤로가기" className="back-icon"/>
        </button>
        <h2>상영관 등록</h2>
        <input
          type="text"
          placeholder="상영관 이름 (예: 4관)"
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
        />
        <div>
          <input
            type="text"
            placeholder="행 (예: A)"
            value={row}
            onChange={(e) => setRow(e.target.value)}
          />
          <input
            type="number"
            placeholder="열 (예: 5)"
            value={col}
            onChange={(e) => setCol(e.target.value)}
          />
          <button onClick={addSeat}>좌석 추가</button>
        </div>
        <div>
          <p>좌석 목록: {seats.map((s, i) => `${s.rowNo}${s.colNo}`).join(', ')}</p>
        </div>
        <button onClick={handleRegister}>상영관 등록</button>

        <hr />

        <h2>상영관 삭제</h2>
        <input
          type="text"
          placeholder="삭제할 상영관 이름"
          value={deleteName}
          onChange={(e) => setDeleteName(e.target.value)}
        />
        <button onClick={handleDelete}>삭제</button>

        <hr />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default AdminScreenPage;
