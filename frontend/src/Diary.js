// src/Diary.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Diary() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem('nickname');
  const partner = localStorage.getItem('partner');
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [diaryText, setDiaryText] = useState('');
  const [partnerDiary, setPartnerDiary] = useState('');
  const [status, setStatus] = useState('');

  // 로그인 정보 없으면 로그인 페이지로 이동
  useEffect(() => {
    if (!nickname || !partner) {
      navigate('/');
    }
  }, [nickname, partner, navigate]);

  // 날짜 선택 시 일기 데이터 가져오기
  useEffect(() => {
    if (selectedDate && nickname) {
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
    }
  }, [selectedDate, nickname]);

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
    if (data.success) setStatus('✅ 저장 완료');
    else setStatus('❌ 저장 실패');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📖 교환일기</h1>
      <p>👥 {partner} --- {nickname}</p>

      <label>날짜 선택: </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {selectedDate && (
        <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
          <div>
            <h3>{partner}가 쓴 일기</h3>
            <div style={{ border: '1px solid gray', padding: '10px', width: '300px', minHeight: '200px' }}>
              {partnerDiary || '아직 작성된 내용이 없습니다.'}
            </div>
          </div>

          <div>
            <h3>{nickname}의 일기</h3>
            <textarea
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              rows={10}
              cols={40}
              placeholder="오늘의 일기를 작성하세요..."
            />
            <br />
            <button onClick={handleSave}>💾 저장</button>
            <p>{status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Diary;
