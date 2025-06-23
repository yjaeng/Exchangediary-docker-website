// src/pages/GoogleLoginPage.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../PageStyle.css'; // ✅ 공통 CSS 불러오기

function GoogleLoginPage() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('✅ 구글 로그인 성공:', decoded);

      localStorage.setItem('email', decoded.email);
      localStorage.setItem('name', decoded.name);
      localStorage.setItem('picture', decoded.picture);

      navigate('/set-nickname');
    } catch (err) {
      console.error('❌ JWT 디코딩 실패:', err);
      alert('로그인 처리 중 오류 발생');
    }
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/1.png)` }}
    >
      <div className="paper-box">
        <h2 className="diary-title">📓 교환일기 로그인</h2>
        <p className="guide">Google 계정으로 로그인해주세요</p>
        <div className="google-button">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert('❌ 로그인 실패')}
          />
        </div>
      </div>
    </div>
  );
}

export default GoogleLoginPage;

