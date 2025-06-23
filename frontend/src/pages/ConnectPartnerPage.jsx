import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../PageStyle.css';

function ConnectPartnerPage() {
  const [partner, setPartner] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    const trimmed = partner.trim();
    if (!trimmed) {
      alert('상대 별명을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 1. 존재 확인
      const checkRes = await fetch(`http://localhost:5000/check-partner?partner=${trimmed}`);
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.exists) {
        alert('❌ 존재하지 않는 별명입니다. 다시 확인해주세요.');
        return;
      }

      // 2. 양방향 연결
      const myNickname = localStorage.getItem('nickname');
      const connectRes = await fetch('http://localhost:5000/connect-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myNickname,
          partnerNickname: trimmed,
        }),
      });

      const connectData = await connectRes.json();

      if (!connectRes.ok || !connectData.success) {
        alert(connectData.message || '❌ 연결 실패');
        return;
      }

      // 3. 연결 완료
      localStorage.setItem('partner', trimmed);
      navigate('/home');
    } catch (error) {
      alert('서버 오류로 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/1.png)` }}
    >
      <div className="partt-box">
        <h2 className="diary-title">🔗 상대방 연결</h2>
        <p className="guide">상대방의 별명을 입력하세요</p>
        <input
          className="nickname-input"
          type="text"
          placeholder="예: 홍길동"
          value={partner}
          onChange={(e) => setPartner(e.target.value)}
        />
        <br />
        <button className="submit-button" onClick={handleConnect} disabled={loading}>
          {loading ? '🔄 연결 중...' : '연결하기'}
        </button>
      </div>
    </div>
  );
}

export default ConnectPartnerPage;

