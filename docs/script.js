// GitHub 기반 체스 게임 클라이언트
class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.gameMode = 'online';
        this.roomId = '';
        this.playerName = '';
        this.playerColor = '';
        this.gameState = null;
        this.pollingInterval = null;
        
        this.init();
    }

    init() {
        this.createBoard();
        this.setupEventListeners();
        this.updateGameInfo();
    }

    createBoard() {
        const chessboard = document.getElementById('chessboard');
        chessboard.innerHTML = '';

        // 초기 체스보드 상태
        this.board = [
            ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        ];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                square.textContent = this.board[row][col];
                square.addEventListener('click', (e) => this.handleSquareClick(e));
                chessboard.appendChild(square);
            }
        }
    }

    setupEventListeners() {
        // 게임 모드 버튼
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameMode = e.target.textContent.toLowerCase().replace(' ', '-');
                this.resetGame();
            });
        });

        // 방 입장 버튼
        document.querySelector('button[onclick="joinRoom()"]').addEventListener('click', () => {
            this.joinRoom();
        });
    }

    handleSquareClick(event) {
        const square = event.target;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = this.board[row][col];

        // 온라인 모드에서 자신의 턴이 아닌 경우 클릭 무시
        if (this.gameMode === 'online' && this.currentPlayer !== this.playerColor) {
            return;
        }

        // 말이 선택된 상태
        if (this.selectedPiece) {
            const selectedRow = this.selectedPiece.row;
            const selectedCol = this.selectedPiece.col;

            // 같은 말을 다시 클릭한 경우 선택 해제
            if (selectedRow === row && selectedCol === col) {
                this.clearSelection();
                return;
            }

            // 유효한 이동인지 확인
            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                // 말 이동
                this.movePiece(selectedRow, selectedCol, row, col);
                this.clearSelection();
            } else {
                // 다른 말을 선택
                if (piece && this.isOwnPiece(piece)) {
                    this.selectPiece(row, col, piece);
                }
            }
        } else {
            // 말 선택
            if (piece && this.isOwnPiece(piece)) {
                this.selectPiece(row, col, piece);
            }
        }
    }

    selectPiece(row, col, piece) {
        this.selectedPiece = { row, col, piece };
        
        // 선택된 말 하이라이트
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');

        // 유효한 이동 위치 표시
        this.showValidMoves(row, col);
    }

    clearSelection() {
        this.selectedPiece = null;
        
        // 모든 하이라이트 제거
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'capture');
        });
    }

    showValidMoves(row, col) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(row, col, r, c)) {
                    const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    const targetPiece = this.board[r][c];
                    
                    if (targetPiece) {
                        square.classList.add('capture');
                    } else {
                        square.classList.add('valid-move');
                    }
                }
            }
        }
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];

        // 빈 칸에서 이동하려는 경우
        if (!piece) return false;

        // 같은 위치로 이동하려는 경우
        if (fromRow === toRow && fromCol === toCol) return false;

        // 상대방 말을 잡으려는 경우
        if (targetPiece && targetPiece !== '') {
            // 같은 색의 말을 잡으려는 경우
            if (this.isOwnPiece(targetPiece)) {
                return false;
            }
        }

        // 간단한 이동 규칙 (실제 체스 규칙은 더 복잡)
        return true;
    }

    isOwnPiece(piece) {
        if (this.gameMode === 'online') {
            // 온라인 모드에서는 플레이어 색상에 따라 판단
            const isWhitePiece = piece.charCodeAt(0) > 9819;
            return (this.playerColor === 'white' && isWhitePiece) ||
                   (this.playerColor === 'black' && !isWhitePiece);
        } else {
            // 로컬 모드에서는 현재 플레이어에 따라 판단
            const isWhitePiece = piece.charCodeAt(0) > 9819;
            return (this.currentPlayer === 'white' && isWhitePiece) ||
                   (this.currentPlayer === 'black' && !isWhitePiece);
        }
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        
        // 보드 업데이트
        this.board[fromRow][fromCol] = '';
        this.board[toRow][toCol] = piece;

        // UI 업데이트
        const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
        const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        
        fromSquare.textContent = '';
        toSquare.textContent = piece;

        // 온라인 모드에서 서버에 이동 전송
        if (this.gameMode === 'online') {
            this.sendMoveToServer(fromRow, fromCol, toRow, toCol);
        } else {
            // 로컬 모드에서 턴 변경
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
            this.updateGameInfo();
        }
    }

    async sendMoveToServer(fromRow, fromCol, toRow, toCol) {
        try {
            const moveData = {
                fromRow,
                fromCol,
                toRow,
                toCol,
                playerColor: this.playerColor
            };

            // GitHub Actions를 트리거하여 이동 처리
            const response = await fetch(`https://api.github.com/repos/${this.getRepoOwner()}/${this.getRepoName()}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.getGitHubToken()}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'game-action',
                    client_payload: {
                        action: 'make-move',
                        room_id: this.roomId,
                        move_data: JSON.stringify(moveData)
                    }
                })
            });

            if (response.ok) {
                console.log('Move sent to server successfully');
                // 잠시 후 게임 상태 업데이트
                setTimeout(() => this.updateGameState(), 2000);
            } else {
                console.error('Failed to send move to server');
            }
        } catch (error) {
            console.error('Error sending move:', error);
        }
    }

    async updateGameState() {
        try {
            // GitHub API를 통해 게임 상태 조회
            const response = await fetch(`https://api.github.com/repos/${this.getRepoOwner()}/${this.getRepoName()}/issues?labels=chess-game&state=open`);
            const issues = await response.json();

            const gameIssue = issues.find(issue => 
                issue.title.includes(`Chess Game: ${this.roomId}`)
            );

            if (gameIssue) {
                // 게임 상태 파싱
                const gameStateMatch = gameIssue.body.match(/```json\n([\s\S]*?)\n```/);
                if (gameStateMatch) {
                    this.gameState = JSON.parse(gameStateMatch[1]);
                    this.updateBoardFromGameState();
                }
            }
        } catch (error) {
            console.error('Error updating game state:', error);
        }
    }

    updateBoardFromGameState() {
        if (!this.gameState) return;

        // 보드 업데이트
        this.board = this.gameState.board;
        this.currentPlayer = this.gameState.currentPlayer;

        // UI 업데이트
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                square.textContent = this.board[row][col];
            }
        }

        this.updateGameInfo();
    }

    async joinRoom() {
        const roomIdInput = document.getElementById('room-id');
        const playerNameInput = document.getElementById('player-name');
        
        this.roomId = roomIdInput.value.trim();
        this.playerName = playerNameInput.value.trim();

        if (!this.roomId || !this.playerName) {
            alert('방 ID와 플레이어 이름을 입력해주세요.');
            return;
        }

        try {
            // 게임 참가 요청
            const response = await fetch(`https://api.github.com/repos/${this.getRepoOwner()}/${this.getRepoName()}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.getGitHubToken()}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'game-action',
                    client_payload: {
                        action: 'join-game',
                        room_id: this.roomId,
                        player_name: this.playerName
                    }
                })
            });

            if (response.ok) {
                console.log('Joined game successfully');
                this.playerColor = 'black'; // 두 번째 플레이어는 검은색
                this.startPolling();
                this.updateConnectionStatus('connected');
            } else {
                console.error('Failed to join game');
                this.updateConnectionStatus('disconnected');
            }
        } catch (error) {
            console.error('Error joining game:', error);
            this.updateConnectionStatus('disconnected');
        }
    }

    startPolling() {
        // 주기적으로 게임 상태 업데이트
        this.pollingInterval = setInterval(() => {
            this.updateGameState();
        }, 5000); // 5초마다 업데이트
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        statusElement.textContent = `연결 상태: ${status === 'connected' ? '연결됨' : '연결 안됨'}`;
        statusElement.className = `connection-status ${status}`;
    }

    updateGameInfo() {
        const currentPlayerElement = document.getElementById('current-player');
        const gameStatusElement = document.getElementById('game-status');
        
        currentPlayerElement.textContent = `현재 플레이어: ${this.currentPlayer === 'white' ? '흰색' : '검은색'}`;
        
        if (this.gameMode === 'online') {
            gameStatusElement.textContent = `게임 모드: 온라인 (${this.playerColor})`;
        } else {
            gameStatusElement.textContent = `게임 모드: 로컬`;
        }
    }

    resetGame() {
        this.createBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.clearSelection();
        this.updateGameInfo();
        this.stopPolling();
        this.updateConnectionStatus('disconnected');
    }

    // GitHub 관련 헬퍼 함수들
    getRepoOwner() {
        // 실제 구현에서는 환경변수나 설정에서 가져와야 함
        return 'your-username';
    }

    getRepoName() {
        return 'chess-multiplayer';
    }

    getGitHubToken() {
        // 실제 구현에서는 사용자 입력이나 환경변수에서 가져와야 함
        return 'your-github-token';
    }
}

// 게임 초기화
let game;

// 전역 함수들 (HTML에서 호출)
function startOnlineMode() {
    game.gameMode = 'online';
    game.resetGame();
}

function startLocalMode() {
    game.gameMode = 'local';
    game.resetGame();
}

function startAIMode() {
    game.gameMode = 'ai';
    game.resetGame();
}

function newGame() {
    game.resetGame();
}

function resetGame() {
    game.resetGame();
}

function undoMove() {
    // 되돌리기 기능 구현
    console.log('Undo move');
}

function joinRoom() {
    game.joinRoom();
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    game = new ChessGame();
}); 