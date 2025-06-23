const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 상태 확인
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Express 상태</title></head>
      <body>
        <h2>✅ 교환일기 백엔드 작동 중!</h2>
      </body>
    </html>
  `);
});

// 프론트 연결 확인
app.get('/api', (req, res) => {
  res.json('✅ 프론트와 백엔드 연결 성공!');
});

// ✅ 사용자 정보 (닉네임 기반)
const users = []; // ← 초기 사용자 없음

// ✅ 파트너 닉네임 존재 확인 API
app.get('/check-partner', (req, res) => {
  const { partner } = req.query;
  const exists = users.some((user) => user.nickname === partner);
  res.json({ exists });
});

// ✅ 닉네임 등록 API
app.post('/set-nickname', (req, res) => {
  const { email, nickname } = req.body;

  const alreadyExists = users.some((u) => u.email === email || u.nickname === nickname);
  if (alreadyExists) {
    return res.status(400).json({ success: false, message: '이미 등록된 이메일 또는 닉네임입니다.' });
  }

  users.push({ email, nickname, partner: null });
  res.json({ success: true });
});

// ✅ 상대방 연결 API
app.post('/connect-partner', (req, res) => {
  const { myNickname, partnerNickname } = req.body;

  const me = users.find((u) => u.nickname === myNickname);
  const partner = users.find((u) => u.nickname === partnerNickname);

  if (!me || !partner) {
    return res.status(404).json({ success: false, message: '닉네임을 찾을 수 없습니다.' });
  }

  me.partner = partnerNickname;
  partner.partner = myNickname;

  res.json({ success: true, message: '상대 연결 성공' });
});

// ✅ 일기 저장용 메모리 객체
const diaryData = {}; // 구조: { 닉네임: { "yyyy-mm-dd": "내용" } }

// ✅ 일기 조회 API
app.get('/diary', (req, res) => {
  const { user, date } = req.query;

  const myDiary = diaryData?.[user]?.[date] || '';
  const partner = users.find((u) => u.nickname === user)?.partner;
  const partnerDiary = diaryData?.[partner]?.[date] || '';

  res.json({ myDiary, partnerDiary });
});

// ✅ 일기 저장 API
app.post('/diary', (req, res) => {
  const { user, date, text } = req.body;

  if (!diaryData[user]) {
    diaryData[user] = {};
  }

  diaryData[user][date] = text;
  res.json({ success: true });
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend is running at http://localhost:${PORT}`);
});

app.get('/users', (req, res) => {
  res.json(users);
});

// ✅ 이메일로 닉네임 조회 API
app.get('/get-nickname', (req, res) => {
  const { email } = req.query;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ nickname: user.nickname });
  } else {
    res.status(404).json({ message: '사용자 없음' });
  }
});
