// src/pages/DiaryPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PageStyle.css'; // ✅ 공통 스타일

function DiaryPage() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem('nickname');
  const partner = localStorage.getItem('partner');
  const selectedDate = localStorage.getItem('selectedDate');

  const [diaryText, setDiaryText] = useState('');
  const [partnerDiary, setPartnerDiary] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!nickname || !partner || !selectedDate) {
      navigate('/home');
      return;
    }

    fetch(`http://localhost:5000/diary?user=${nickname}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setDiaryText(data.myDiary || '');
        setPartnerDiary(data.partnerDiary || '');
      })
      .catch(() => {
        setDiaryText('');
        setPartnerDiary('');
      });
  }, [nickname, partner, selectedDate, navigate]);

  const handleSave = async () => {
    const res = await fetch('http://localhost:5000/diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: nickname,
        date: selectedDate,
        text: diaryText,
      }),
    });

    const data = await res.json();
    setStatus(data.success ? '저장 완료' : '저장 실패');
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/2.png)` }} // ✅ 여기서 배경 경로 지정
    >
      <div className="diary-container">
        {/* 왼쪽: 파트너 일기 */}
        <div className="left-diary-box">
          <h3>  {partner}의 일기</h3>
          <div className="left-diary-content">
            {partnerDiary || '아직 작성된 내용이 없습니다.'}
          </div>
        </div>

        {/* 오른쪽: 내 일기 */}
        <div className="right-diary-box">
          <h3>  {nickname}의 일기 </h3>
          <textarea
            className="right-diary-input"
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="오늘의 일기를 작성하세요..."
      />
          <p>{status}</p>
        </div>
        <div className="selected-date-text">{selectedDate}</div>
        <button className="save-button" onClick={handleSave}>
            저장
          </button>
      </div>
    </div>
  );
}

export default DiaryPage;

