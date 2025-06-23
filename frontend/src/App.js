// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AutoLoginPage from './pages/AutoLoginPage';
import GoogleLoginPage from './pages/GoogleLoginPage';
import SetNicknamePage from './pages/SetNicknamePage';
import ConnectPartnerPage from './pages/ConnectPartnerPage';
import SelectDatePage from './pages/SelectDatePage';   // ✅ 새로 추가
import DiaryPage from './pages/DiaryPage';             // ✅ 새로 추가

const GOOGLE_CLIENT_ID = '334307332625-hta6sa6j5n81t6apcfh3tk5fk29fmnje.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<AutoLoginPage />} />
          <Route path="/login" element={<GoogleLoginPage />} />
          <Route path="/set-nickname" element={<SetNicknamePage />} />
          <Route path="/connect" element={<ConnectPartnerPage />} />
          <Route path="/home" element={<SelectDatePage />} />     {/* 날짜 선택용 */}
          <Route path="/diary" element={<DiaryPage />} />         {/* 일기 작성용 */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

