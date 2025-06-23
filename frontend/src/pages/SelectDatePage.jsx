// src/pages/SelectDatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PageStyle.css'; // ✅ 공통 스타일 가져오기

function SelectDatePage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const handleNext = () => {
    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    localStorage.setItem('selectedDate', selectedDate);
    navigate('/diary');
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/1.png)` }} // ✅ 동적으로 배경 이미지 지정
    >
      <div className="dayy-box">
        <h2 className="diary-title">날짜 선택</h2>
        <input
          className="nickname-input"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <br />
        <button className="submit-button" onClick={handleNext}>
          일기 쓰기 →
        </button>
      </div>
    </div>
  );
}

export default SelectDatePage;
