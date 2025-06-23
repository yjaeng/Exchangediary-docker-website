import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AutoLoginPage() {

  useEffect(() => {
    localStorage.clear();
    
    const email = localStorage.getItem('email');

    if (!email) {
      navigate('/login');  // ✅ 경고창 없이 자연스럽게 이동
      return;
    }

    fetch(`http://localhost:5000/get-nickname?email=${email}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        localStorage.setItem('nickname', data.nickname);
        navigate('/connect');
      })
      .catch(() => {
        navigate('/set-nickname');
      });
  }, [navigate]);

  return <p style={{ textAlign: 'center', marginTop: '100px' }}>🔄 자동 로그인 중...</p>;
}

export default AutoLoginPage;
