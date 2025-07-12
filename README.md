# ♔ 체스 온라인 대전 ♔

실시간으로 상대방과 체스를 즐길 수 있는 온라인 체스 게임입니다.

## 🎮 게임 특징

- **실시간 멀티플레이어**: WebSocket을 사용한 실시간 대전
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **다양한 게임 모드**: 온라인 대전, 로컬 대전, AI 대전
- **현대적인 UI**: 아름다운 그라데이션과 애니메이션
- **무료 호스팅**: GitHub Pages + Render로 완전 무료 운영

## 🚀 배포 방법

### 1. GitHub 저장소 생성
```bash
# 저장소 클론
git clone https://github.com/[username]/chess-multiplayer.git
cd chess-multiplayer
```

### 2. GitHub Pages 설정
1. GitHub 저장소 설정 → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Save

### 3. Render 백엔드 배포
1. [Render.com](https://render.com) 가입
2. New Web Service
3. GitHub 저장소 연결
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`

### 4. 환경변수 설정
- **Render**: `PORT` (자동 설정됨)
- **GitHub Actions**: `RENDER_WEBHOOK` (선택사항)

## 🛠️ 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript**: ES6+, WebSocket API
- **GitHub Pages**: 무료 호스팅

### 백엔드
- **Node.js**: 서버 런타임
- **WebSocket**: 실시간 통신
- **Render**: 무료 서버 호스팅

### 배포
- **GitHub Actions**: 자동 배포
- **GitHub Pages**: 정적 사이트 호스팅
- **Render**: 백엔드 서버 호스팅

## 📁 프로젝트 구조

```
chess-multiplayer/
├── frontend/              # GitHub Pages용
│   ├── index.html        # 메인 페이지
│   ├── style.css         # 스타일시트
│   └── script.js         # 클라이언트 로직
├── backend/              # Render용
│   ├── server.js         # WebSocket 서버
│   └── package.json      # 의존성 관리
├── .github/
│   └── workflows/        # GitHub Actions
│       └── deploy.yml    # 자동 배포 설정
└── README.md            # 프로젝트 설명
```

## 🎯 게임 모드

### 온라인 대전
- 실시간으로 상대방과 체스 대전
- 방 ID를 공유하여 친구와 함께 플레이
- WebSocket을 통한 실시간 동기화

### 로컬 대전
- 같은 기기에서 두 명이 번갈아가며 플레이
- 오프라인에서도 즐길 수 있음

### AI 대전
- 다양한 난이도의 AI와 대전
- 체스 전술 학습에 도움

## 🎨 UI 특징

- **반응형 디자인**: 모든 화면 크기 지원
- **모던한 UI**: 그라데이션과 그림자 효과
- **부드러운 애니메이션**: 말 이동 시 시각적 피드백
- **직관적인 컨트롤**: 터치 친화적 인터페이스

## 🔧 개발 환경 설정

### 로컬 개발
```bash
# 저장소 클론
git clone https://github.com/[username]/chess-multiplayer.git
cd chess-multiplayer

# 백엔드 의존성 설치
cd backend
npm install

# 서버 실행
npm start

# 프론트엔드 (브라우저에서)
open frontend/index.html
```

### 환경변수
```bash
# .env 파일 생성 (선택사항)
PORT=3000
NODE_ENV=development
```

## 🚀 배포 URL

- **프론트엔드**: `https://[username].github.io/chess-multiplayer/`
- **백엔드**: `https://[app-name].onrender.com`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- **GitHub**: 무료 저장소 및 Pages 호스팅
- **Render**: 무료 백엔드 호스팅
- **WebSocket**: 실시간 통신 기술
- **체스 커뮤니티**: 영감과 피드백

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**즐거운 체스 게임 되세요! ♔♕♖♗♘♙** 