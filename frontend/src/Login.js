import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.partner) {
        // ✅ localStorage에 유저 정보 저장
        localStorage.setItem('username', data.username);
        localStorage.setItem('partner', data.partner);

        // ✅ 홈 화면으로 이동
        navigate('/home');
      } else {
        setError('❌ 로그인 실패');
      }
    } catch {
      setError('서버 연결 오류');
    }
    
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>로그인</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="아이디"
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <br />
      <button onClick={handleLogin}>로그인</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
