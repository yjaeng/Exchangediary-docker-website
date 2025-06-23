// src/pages/SetNicknamePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PageStyle.css';

function SetNicknamePage() {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      fetch(`http://localhost:5000/get-nickname?email=${email}`)
        .then(res => res.json())
        .then(data => {
          if (data.nickname) {
            localStorage.setItem('nickname', data.nickname);
            // ✅ email도 다시 저장 (혹시 빠졌을 경우 대비)
            localStorage.setItem('email', email);
            navigate('/connect');
          }
        })
        .catch(err => {
          console.error('별명 자동 조회 실패:', err);
        });
    }
  }, [navigate]);

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      alert('별명을 입력해주세요!');
      return;
    }

    setLoading(true);
    const email = localStorage.getItem('email');
    if (!email) {
      alert('로그인 정보가 없습니다. 처음부터 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/set-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname: trimmed }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('nickname', trimmed);
        navigate('/connect');
      } else {
        alert(data.message || '별명 등록 실패!');
      }
    } catch (err) {
      alert('서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/1.png)` }} // ✅ 동적으로 배경 이미지 지정
    >
      <div className="nickname-box">  {/* ← 여기에 적용 */}
        <h2 className="diary-title">📝 별명 설정</h2>
        <p className="guide">교환일기에서 사용할 별명을 정해주세요.</p>
        <input
          className="nickname-input"
          type="text"
          placeholder="예: 홍길동"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <br />
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          별명 저장
        </button>
      </div>
    </div>
  );
}

export default SetNicknamePage;
