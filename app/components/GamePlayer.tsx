"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ============================================================
   ƏSAS YÖNLƏNDİRİCİ
   ============================================================ */
export default function GamePlayer({ slug }: { slug: string }) {
  const goBack = () => window.history.back();

  switch (slug) {
    case "snake": return <SnakeGame onBack={goBack} />;
    case "tictactoe": return <TicTacToeGame onBack={goBack} />;
    case "memory": return <MemoryGame onBack={goBack} />;
    case "minesweeper": return <MinesweeperGame onBack={goBack} />;
    case "hangman": return <HangmanGame onBack={goBack} />;
    case "wordle": return <WordleGame onBack={goBack} />;
    case "flappybird": return <FlappyBirdGame onBack={goBack} />;
    case "breakout": return <BreakoutGame onBack={goBack} />;
    case "pong": return <PongGame onBack={goBack} />;
    case "2048": return <Game2048 onBack={goBack} />;
    case "tetris": return <TetrisGame onBack={goBack} />;
    case "simon": return <SimonGame onBack={goBack} />;
    case "typing": return <TypingGame onBack={goBack} />;
    case "quiz": return <QuizGame onBack={goBack} />;
    case "slots": return <SlotsGame onBack={goBack} />;
    default: return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-gray-900 rounded-2xl p-10 border border-gray-800">
          <p className="text-3xl mb-4">😕</p>
          <h2 className="text-xl font-bold mb-2">Oyun tapılmadı</h2>
          <p className="text-gray-400 mb-4">Bu oyun mövcud deyil və ya silinib.</p>
          <button onClick={goBack} className="btn-primary">← Geri qayıt</button>
        </div>
      </div>
    );
  }
}

/* ============================================================
   ORTAQ KONTEYNER
   ============================================================ */
function GameContainer({ children, onBack, title, score }: {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
  score?: number;
}) {
  return (
    <div className="game-container">
      <div className="game-wrapper animate-bounce-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {score !== undefined && <span className="text-green-400 font-bold text-xl">{score}</span>}
        </div>
        <div className="flex flex-col items-center">{children}</div>
        <button onClick={onBack} className="btn-primary mt-6">← Geri</button>
      </div>
    </div>
  );
}

/* ============================================================
   1. SNAKE
   ============================================================ */
function SnakeGame({ onBack }: { onBack: () => void }) {
  const GRID = 20, SPEED = 100;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const randomFood = useCallback(() => ({
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID),
  }), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        setDir(keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const d = dirRef.current;
        const newHead = { x: head.x + d.x, y: head.y + d.y };
        if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
          setGameOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(randomFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [gameOver, food, randomFood]);

  const reset = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(randomFood());
    setDir({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <GameContainer onBack={onBack} title="🐍 Snake" score={score}>
      <div className="grid gap-px bg-gray-800 p-px rounded-lg" style={{ gridTemplateColumns: `repeat(${GRID}, 22px)` }}>
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const x = i % GRID, y = Math.floor(i / GRID);
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div key={i} className={`w-[22px] h-[22px] rounded-sm ${
              isHead ? "bg-green-400 shadow-lg" : isBody ? "bg-green-600" : isFood ? "bg-red-400 animate-pulse rounded-full" : "bg-gray-900"
            }`} />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-red-400 font-bold mb-2">Oyun Bitdi!</p>
          <button onClick={reset} className="btn-primary">Yenidən Başla</button>
        </div>
      )}
      <p className="text-gray-500 text-xs mt-3">Ox düymələri ilə idarə et</p>
    </GameContainer>
  );
}

/* ============================================================
   2. TIC TAC TOE
   ============================================================ */
function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const winner = calculateWinner(board);

  const click = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isX ? "X" : "O";
    setBoard(newBoard);
    setIsX(!isX);
  };
  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
  };

  const status = winner ? `Qalib: ${winner}` : board.every(Boolean) ? "Heç-heçə!" : `Növbə: ${isX ? "X" : "O"}`;
  return (
    <GameContainer onBack={onBack} title="⭕ Tic Tac Toe">
      <p className={`text-lg font-semibold mb-4 ${winner ? "text-green-400" : ""}`}>{status}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button key={i} onClick={() => click(i)} className={`w-20 h-20 text-3xl font-bold rounded-xl transition-all ${
            cell === "X" ? "bg-blue-500/30 text-blue-400" : cell === "O" ? "bg-red-500/30 text-red-400" : "bg-gray-800 hover:bg-gray-700 text-gray-600"
          }`}>{cell}</button>
        ))}
      </div>
      {(winner || board.every(Boolean)) && <button onClick={reset} className="btn-primary mt-6">Yenidən Başla</button>}
    </GameContainer>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

/* ============================================================
   3. MEMORY
   ============================================================ */
function MemoryGame({ onBack }: { onBack: () => void }) {
  const emojis = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  const [revealed, setRevealed] = useState<boolean[]>(Array(16).fill(false));
  const [matched, setMatched] = useState<boolean[]>(Array(16).fill(false));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const clickCard = (i: number) => {
    if (revealed[i] || matched[i] || selected.length >= 2) return;
    const newRevealed = [...revealed];
    newRevealed[i] = true;
    setRevealed(newRevealed);
    const newSelected = [...selected, i];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      if (cards[a] === cards[b]) {
        const newMatched = [...matched];
        newMatched[a] = true; newMatched[b] = true;
        setMatched(newMatched);
        setSelected([]);
      } else {
        setTimeout(() => {
          const hide = [...revealed];
          hide[a] = false; hide[b] = false;
          setRevealed(hide);
          setSelected([]);
        }, 800);
      }
    }
  };
  const won = matched.every(Boolean);

  return (
    <GameContainer onBack={onBack} title="🧠 Memory" score={moves}>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((emoji, i) => (
          <button key={i} onClick={() => clickCard(i)}
            className={`w-16 h-16 text-2xl rounded-xl transition-all ${
              matched[i] ? "bg-green-500/30" : revealed[i] ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-500"
            }`}>{revealed[i] || matched[i] ? emoji : "?"}</button>
        ))}
      </div>
      {won && <p className="text-green-400 mt-3">Təbriklər! {moves} addımda tapdın!</p>}
    </GameContainer>
  );
}

/* ============================================================
   4. MINESWEEPER
   ============================================================ */
function MinesweeperGame({ onBack }: { onBack: () => void }) {
  const SIZE = 10, MINES = 15;
  const [board, setBoard] = useState<any[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => { resetBoard(); }, []);

  const resetBoard = () => {
    const b = Array(SIZE).fill(null).map(() => Array(SIZE).fill({ mine: false, revealed: false, flag: false, adjacent: 0 }));
    let mines = 0;
    while (mines < MINES) {
      const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
      if (!b[r][c].mine) { b[r][c] = { ...b[r][c], mine: true }; mines++; }
    }
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (!b[r][c].mine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && b[nr][nc].mine) count++;
        }
        b[r][c] = { ...b[r][c], adjacent: count };
      }
    }
    setBoard(b); setGameOver(false); setWin(false);
  };

  const reveal = (r: number, c: number) => {
    if (gameOver || win || board[r][c].revealed || board[r][c].flag) return;
    const newBoard = board.map(row => [...row]);
    if (newBoard[r][c].mine) {
      newBoard.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
      setBoard(newBoard); setGameOver(true); return;
    }
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      if (cr < 0 || cr >= SIZE || cc < 0 || cc >= SIZE || newBoard[cr][cc].revealed) continue;
      newBoard[cr][cc].revealed = true;
      if (newBoard[cr][cc].adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) stack.push([cr+dr, cc+dc]);
      }
    }
    if (newBoard.every(row => row.every((cell: any) => cell.revealed || cell.mine))) setWin(true);
    setBoard(newBoard);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || board[r][c].revealed) return;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c].flag = !newBoard[r][c].flag;
    setBoard(newBoard);
  };

  return (
    <GameContainer onBack={onBack} title="💣 Minesweeper">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 32px)` }}>
        {board.map((row, r) => row.map((cell: any, c: number) => (
          <div key={`${r}-${c}`} onClick={() => reveal(r, c)} onContextMenu={(e) => toggleFlag(e, r, c)}
            className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded cursor-pointer select-none ${
              cell.revealed ? (cell.mine ? "bg-red-600" : "bg-gray-700") : "bg-gray-600 hover:bg-gray-500"
            } ${cell.flag ? "bg-orange-500" : ""}`}>
            {cell.flag ? "🚩" : cell.revealed && cell.mine ? "💣" : cell.revealed && cell.adjacent > 0 ? cell.adjacent : ""}
          </div>
        )))}
      </div>
      {(gameOver || win) && (
        <div className="mt-4 text-center">
          <p className={win ? "text-green-400" : "text-red-400"}>{win ? "Qazandın!" : "Partladı!"}</p>
          <button onClick={resetBoard} className="btn-primary mt-2">Yenidən</button>
        </div>
      )}
    </GameContainer>
  );
}

/* ============================================================
   5. HANGMAN (işlək)
   ============================================================ */
function HangmanGame({ onBack }: { onBack: () => void }) {
  const words = ["REACT","NEXT","JAVASCRIPT","TYPESCRIPT","TAILWIND"];
  const [word] = useState(words[Math.floor(Math.random()*words.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const wrong = guessed.filter(l => !word.includes(l)).length;
  const maxWrong = 6;
  const won = word.split("").every(l => guessed.includes(l));
  const lost = wrong >= maxWrong;

  const addLetter = (l: string) => {
    if (!guessed.includes(l) && !won && !lost) setGuessed([...guessed, l]);
  };
  const reset = () => setGuessed([]);

  return (
    <GameContainer onBack={onBack} title="🎯 Hangman">
      <div className="text-2xl tracking-widest mb-4">
        {word.split("").map((l,i) => <span key={i} className="mx-1">{guessed.includes(l) ? l : "_"}</span>)}
      </div>
      <p className="text-red-400">Səhv: {wrong}/{maxWrong}</p>
      <div className="flex flex-wrap gap-1 mt-4 justify-center">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
          <button key={l} onClick={() => addLetter(l)} disabled={guessed.includes(l) || won || lost}
            className="px-2 py-1 bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-600">{l}</button>
        ))}
      </div>
      {(won || lost) && (
        <div className="mt-4">
          <p className={won ? "text-green-400" : "text-red-400"}>{won ? "Qazandın!" : `Söz: ${word}`}</p>
          <button onClick={reset} className="btn-primary mt-2">Yeni Söz</button>
        </div>
      )}
    </GameContainer>
  );
}

/* ============================================================
   6. WORDLE (sadələşdirilmiş)
   ============================================================ */
function WordleGame({ onBack }: { onBack: () => void }) {
  const target = "REACT";
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (current.length !== 5) return;
    setGuesses([...guesses, current]);
    if (current === target) setMessage("Təbriklər!");
    else if (guesses.length + 1 >= 6) setMessage(`Uğursuz! Söz: ${target}`);
    setCurrent("");
  };
  const reset = () => { setGuesses([]); setCurrent(""); setMessage(""); };

  return (
    <GameContainer onBack={onBack} title="🟩 Wordle">
      <div className="grid gap-1 mb-4">
        {Array(6).fill(null).map((_, i) => (
          <div key={i} className="flex gap-1">
            {Array(5).fill(null).map((_, j) => {
              const letter = guesses[i]?.[j] || (i === guesses.length ? current[j] : "");
              const color = guesses[i] ? (letter === target[j] ? "bg-green-500" : target.includes(letter) ? "bg-yellow-500" : "bg-gray-600") : "bg-gray-800 border border-gray-600";
              return <div key={j} className={`w-10 h-10 flex items-center justify-center text-xl font-bold rounded ${color}`}>{letter}</div>;
            })}
          </div>
        ))}
      </div>
      {!message && <input value={current} onChange={e => setCurrent(e.target.value.toUpperCase().slice(0,5))} onKeyDown={e => e.key==="Enter" && submit()} className="bg-gray-800 rounded px-3 py-2 text-center tracking-widest" placeholder="5 hərf" />}
      {message && <p className="mb-2">{message}</p>}
      {message && <button onClick={reset} className="btn-primary">Yenidən</button>}
    </GameContainer>
  );
}

/* ============================================================
   7. FLAPPY BIRD (canvas)
   ============================================================ */
function FlappyBirdGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const bird = useRef({ y: 150, vy: 0 });
  const pipes = useRef<{ x: number; top: number }[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    const reset = () => {
      bird.current = { y: 150, vy: 0 };
      pipes.current = [{ x: 300, top: 100 }];
      setScore(0);
      setGameOver(false);
    };
    const jump = () => { bird.current.vy = -6; };
    const loop = () => {
      if (gameOver) return;
      frame.current++;
      ctx.clearRect(0, 0, 300, 400);
      ctx.fillStyle = "yellow";
      ctx.fillRect(50, bird.current.y, 20, 20);
      if (frame.current % 80 === 0) pipes.current.push({ x: 300, top: Math.random() * 200 + 30 });
      pipes.current = pipes.current.filter(p => p.x > -40);
      pipes.current.forEach(p => {
        p.x -= 2;
        ctx.fillStyle = "green";
        ctx.fillRect(p.x, 0, 30, p.top);
        ctx.fillRect(p.x, p.top + 80, 30, 400);
        if (p.x === 50) setScore(s => s + 1);
        if ((p.x < 70 && p.x + 30 > 50) && (bird.current.y < p.top || bird.current.y > p.top + 80)) setGameOver(true);
      });
      bird.current.vy += 0.4;
      bird.current.y += bird.current.vy;
      if (bird.current.y > 380 || bird.current.y < 0) setGameOver(true);
      animationId = requestAnimationFrame(loop);
    };
    window.addEventListener("keydown", (e) => { if (e.key === " ") { e.preventDefault(); jump(); } });
    canvas.addEventListener("click", jump);
    reset(); loop();
    return () => { cancelAnimationFrame(animationId); };
  }, [gameOver]);

  return (
    <GameContainer onBack={onBack} title="🐤 Flappy Bird" score={score}>
      <canvas ref={canvasRef} width={300} height={400} className="border border-gray-700 rounded-lg bg-sky-900" />
      {gameOver && <button onClick={() => { setGameOver(false); }} className="btn-primary mt-2">Yenidən Başla</button>}
      <p className="text-xs text-gray-400 mt-1">Boşluq düyməsi / Klik</p>
    </GameContainer>
  );
}

/* ============================================================
   8. BREAKOUT (canvas)
   ============================================================ */
function BreakoutGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let paddle = { x: 250, w: 60 };
    let ball = { x: 280, y: 300, dx: 2, dy: -2 };
    let bricks = Array.from({ length: 5 }, (_, r) => Array.from({ length: 8 }, (_, c) => ({ x: c*70+5, y: r*20+30, visible: true }))).flat();
    const loop = () => {
      ctx.clearRect(0, 0, 580, 380);
      ctx.fillStyle = "white";
      ctx.fillRect(paddle.x, 350, paddle.w, 10);
      ball.x += ball.dx; ball.y += ball.dy;
      ctx.fillRect(ball.x, ball.y, 6, 6);
      if (ball.x <= 0 || ball.x >= 580) ball.dx *= -1;
      if (ball.y <= 0) ball.dy *= -1;
      if (ball.y >= 380) { setGameOver(true); return; }
      if (ball.y >= 340 && ball.x > paddle.x && ball.x < paddle.x + paddle.w) ball.dy *= -1;
      bricks.forEach(b => {
        if (b.visible) {
          ctx.fillStyle = "orange";
          ctx.fillRect(b.x, b.y, 60, 15);
          if (ball.x > b.x && ball.x < b.x+60 && ball.y > b.y && ball.y < b.y+15) {
            b.visible = false; ball.dy *= -1; setScore(s => s+10);
          }
        }
      });
      requestAnimationFrame(loop);
    };
    const movePaddle = (e: MouseEvent) => { paddle.x = e.offsetX - paddle.w/2; };
    canvas.addEventListener("mousemove", movePaddle);
    loop();
    return () => canvas.removeEventListener("mousemove", movePaddle);
  }, [gameOver]);

  return (
    <GameContainer onBack={onBack} title="🧱 Breakout" score={score}>
      <canvas ref={canvasRef} width={580} height={380} className="border border-gray-700 rounded-lg bg-gray-900" />
      {gameOver && <button onClick={() => setGameOver(false)} className="btn-primary mt-2">Yenidən</button>}
    </GameContainer>
  );
}

/* ============================================================
   9. PONG (2 oyunçu)
   ============================================================ */
function PongGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let leftPaddle = { y: 160 }, rightPaddle = { y: 160 };
    let ball = { x: 290, y: 190, dx: 3, dy: 3 };
    const PADDLE_H = 80;
    const loop = () => {
      ctx.clearRect(0, 0, 600, 380);
      ctx.fillStyle = "white";
      ctx.fillRect(10, leftPaddle.y, 10, PADDLE_H);
      ctx.fillRect(580, rightPaddle.y, 10, PADDLE_H);
      ctx.fillRect(ball.x, ball.y, 8, 8);
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.y <= 0 || ball.y >= 372) ball.dy *= -1;
      if (ball.x <= 20 && ball.y > leftPaddle.y && ball.y < leftPaddle.y + PADDLE_H) ball.dx *= -1;
      if (ball.x >= 572 && ball.y > rightPaddle.y && ball.y < rightPaddle.y + PADDLE_H) ball.dx *= -1;
      if (ball.x <= 0) { setScore(s => [s[0], s[1]+1]); ball = { x: 290, y: 190, dx: 3, dy: 3 }; }
      if (ball.x >= 600) { setScore(s => [s[0]+1, s[1]]); ball = { x: 290, y: 190, dx: 3, dy: 3 }; }
      requestAnimationFrame(loop);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "w") leftPaddle.y = Math.max(0, leftPaddle.y - 15);
      if (e.key === "s") leftPaddle.y = Math.min(300, leftPaddle.y + 15);
      if (e.key === "ArrowUp") { e.preventDefault(); rightPaddle.y = Math.max(0, rightPaddle.y - 15); }
      if (e.key === "ArrowDown") { e.preventDefault(); rightPaddle.y = Math.min(300, rightPaddle.y + 15); }
    };
    window.addEventListener("keydown", handleKey);
    loop();
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <GameContainer onBack={onBack} title="🏓 Pong">
      <div className="text-lg mb-2">Sol: {score[0]} | Sağ: {score[1]}</div>
      <canvas ref={canvasRef} width={600} height={380} className="border border-gray-700 rounded-lg bg-gray-900" />
      <p className="text-xs text-gray-400 mt-2">Sol: W/S | Sağ: ←/→</p>
    </GameContainer>
  );
}

/* ============================================================
   10. 2048
   ============================================================ */
function Game2048({ onBack }: { onBack: () => void }) {
  const [grid, setGrid] = useState<number[][]>([...Array(4)].map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => { init(); }, []);

  const init = () => {
    const g = [...Array(4)].map(() => Array(4).fill(0));
    addRandom(g); addRandom(g);
    setGrid(g); setScore(0); setGameOver(false);
  };
  const addRandom = (g: number[][]) => {
    const empty = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) empty.push([r, c]);
    if (empty.length) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      g[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };
  const move = (dir: "up"|"down"|"left"|"right") => {
    let g = grid.map(row => [...row]);
    const rotated = (g: number[][], times: number) => {
      let t = g;
      for (let i = 0; i < times; i++) t = t[0].map((_, idx) => t.map(row => row[idx]).reverse());
      return t;
    };
    if (dir === "up") g = rotated(g, 1);
    if (dir === "down") g = rotated(g, 3);
    if (dir === "right") g = g.map(row => row.reverse());

    let moved = false;
    for (let r = 0; r < 4; r++) {
      let row = g[r].filter(v => v);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          setScore(s => s + row[i]);
          row.splice(i + 1, 1);
          moved = true;
        }
      }
      while (row.length < 4) row.push(0);
      if (row.join() !== g[r].join()) moved = true;
      g[r] = row;
    }
    if (dir === "right") g = g.map(row => row.reverse());
    if (dir === "up") g = rotated(g, 3);
    if (dir === "down") g = rotated(g, 1);

    if (moved) {
      addRandom(g);
      setGrid(g);
      if (!g.flat().includes(0) && !canMove(g)) setGameOver(true);
    }
  };
  const canMove = (g: number[][]) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if ((r < 3 && g[r][c] === g[r+1][c]) || (c < 3 && g[r][c] === g[r][c+1])) return true;
    }
    return false;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        const dirMap: Record<string, "up"|"down"|"left"|"right"> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
        move(dirMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid]);

  return (
    <GameContainer onBack={onBack} title="🔢 2048" score={score}>
      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-3 rounded-xl">
        {grid.flat().map((v, i) => (
          <div key={i} className={`w-16 h-16 flex items-center justify-center text-xl font-bold rounded-lg ${v === 0 ? "bg-gray-700" : "bg-yellow-500/80"}`}>{v || ""}</div>
        ))}
      </div>
      {gameOver && <p className="text-red-400 mt-3">Oyun bitdi!</p>}
      <button onClick={init} className="btn-primary mt-3">Yenidən</button>
    </GameContainer>
  );
}

/* ============================================================
   11. TETRIS (sadə)
   ============================================================ */
function TetrisGame({ onBack }: { onBack: () => void }) {
  return <GameContainer onBack={onBack} title="🧩 Tetris"><p className="text-gray-400">Tezliklə əlavə olunacaq...</p></GameContainer>;
}

/* ============================================================
   12. SIMON
   ============================================================ */
function SimonGame({ onBack }: { onBack: () => void }) {
  const colors = ["red", "blue", "green", "yellow"];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");

  const start = () => {
    setSequence([Math.floor(Math.random()*4)]);
    setPlayerSeq([]);
    setPlaying(true);
    setMessage("İzlə...");
  };

  useEffect(() => {
    if (!playing || sequence.length === 0) return;
    const showSequence = async () => {
      setMessage("Gözlə...");
      for (const idx of sequence) {
        await new Promise(r => setTimeout(r, 600));
        setMessage(colors[idx]);
        await new Promise(r => setTimeout(r, 400));
        setMessage("");
      }
      setMessage("Sənin növbən!");
    };
    showSequence();
  }, [sequence, playing]);

  const clickColor = (idx: number) => {
    if (!playing || message !== "Sənin növbən!") return;
    const newPlayer = [...playerSeq, idx];
    setPlayerSeq(newPlayer);
    if (sequence[newPlayer.length-1] !== idx) {
      setMessage("Səhv! Yenidən başla");
      setPlaying(false);
    } else if (newPlayer.length === sequence.length) {
      setSequence([...sequence, Math.floor(Math.random()*4)]);
      setPlayerSeq([]);
      setMessage("Yaxşı! Növbəti...");
    }
  };

  return (
    <GameContainer onBack={onBack} title="🔴 Simon Says">
      <div className="grid grid-cols-2 gap-2 mb-3">
        {colors.map((c, i) => (
          <button key={c} onClick={() => clickColor(i)} className="w-20 h-20 rounded-xl" style={{ backgroundColor: c, opacity: message === c ? 1 : 0.7 }} />
        ))}
      </div>
      <p className="mb-2">{message}</p>
      {!playing && <button onClick={start} className="btn-primary mt-2">Başla</button>}
    </GameContainer>
  );
}

/* ============================================================
   13. TYPING SPEED
   ============================================================ */
function TypingGame({ onBack }: { onBack: () => void }) {
  const sample = "The quick brown fox jumps over the lazy dog";
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  const check = () => {
    if (input === sample && start) {
      setWpm(Math.round((sample.split(" ").length / ((Date.now() - start) / 60000))));
      setStart(null);
    }
  };
  const begin = () => { setStart(Date.now()); setInput(""); setWpm(0); };

  return (
    <GameContainer onBack={onBack} title="⌨️ Typing Speed">
      <p className="text-gray-400 italic mb-3">"{sample}"</p>
      <textarea value={input} onChange={e => { setInput(e.target.value); if (start) check(); }} className="bg-gray-800 rounded p-2 w-full" rows={2} />
      {wpm > 0 && <p className="text-green-400 mt-2">Sürətin: {wpm} WPM</p>}
      <button onClick={begin} className="btn-primary mt-3">Başla</button>
    </GameContainer>
  );
}

/* ============================================================
   14. QUIZ
   ============================================================ */
function QuizGame({ onBack }: { onBack: () => void }) {
  const questions = [
    { q: "React hansı dildə yazılıb?", opts: ["JavaScript", "Python", "Java"], ans: 0 },
    { q: "Next.js hansı şirkətə məxsusdur?", opts: ["Google", "Vercel", "Facebook"], ans: 1 },
  ];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const answer = (i: number) => {
    setSelected(i);
    if (i === questions[idx].ans) setCorrect(c => c + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(idx+1); setSelected(null); }
    }, 800);
  };

  return (
    <GameContainer onBack={onBack} title="❓ Quiz">
      {idx < questions.length ? (
        <>
          <p className="mb-4">{questions[idx].q}</p>
          {questions[idx].opts.map((opt, i) => (
            <button key={i} onClick={() => answer(i)} className={`block w-full text-left p-2 rounded mb-1 ${
              selected === null ? "bg-gray-700 hover:bg-gray-600" :
              i === questions[idx].ans ? "bg-green-600" : selected === i ? "bg-red-600" : "bg-gray-700"
            }`} disabled={selected !== null}>{opt}</button>
          ))}
        </>
      ) : (
        <p>Nəticə: {correct}/{questions.length}</p>
      )}
    </GameContainer>
  );
}

/* ============================================================
   15. SLOTS
   ============================================================ */
function SlotsGame({ onBack }: { onBack: () => void }) {
  const emojis = ["🍒","🍋","🍊","🍇","⭐"];
  const [reels, setReels] = useState([0,0,0]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  const spin = () => {
    setSpinning(true);
    setMessage("");
    let i = 0;
    const interval = setInterval(() => {
      setReels([Math.floor(Math.random()*5), Math.floor(Math.random()*5), Math.floor(Math.random()*5)]);
      i++;
      if (i > 15) {
        clearInterval(interval);
        setSpinning(false);
        const final = [Math.floor(Math.random()*5), Math.floor(Math.random()*5), Math.floor(Math.random()*5)];
        setReels(final);
        if (final[0] === final[1] && final[1] === final[2]) setMessage("🎉 Qazandın!");
      }
    }, 100);
  };

  return (
    <GameContainer onBack={onBack} title="🎰 Slot Machine">
      <div className="flex gap-4 text-6xl mb-4">
        {reels.map((r, i) => <div key={i} className={`w-24 h-24 flex items-center justify-center bg-gray-800 rounded-xl ${spinning ? "animate-bounce" : ""}`}>{emojis[r]}</div>)}
      </div>
      <p className="text-green-400">{message}</p>
      <button onClick={spin} disabled={spinning} className="btn-primary mt-3">Fırlat</button>
    </GameContainer>
  );
}