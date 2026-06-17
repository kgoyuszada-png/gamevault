import Link from "next/link";

const games = [
  { slug: "snake", name: "Snake", icon: "🐍", diff: "Asan", players: "1", color: "text-green-400" },
  { slug: "tictactoe", name: "Tic Tac Toe", icon: "⭕", diff: "Asan", players: "2", color: "text-blue-400" },
  { slug: "memory", name: "Memory", icon: "🧠", diff: "Orta", players: "1", color: "text-yellow-400" },
  { slug: "minesweeper", name: "Minesweeper", icon: "💣", diff: "Orta", players: "1", color: "text-red-400" },
  { slug: "hangman", name: "Hangman", icon: "🎯", diff: "Asan", players: "1", color: "text-orange-400" },
  { slug: "wordle", name: "Wordle", icon: "🟩", diff: "Orta", players: "1", color: "text-emerald-400" },
  { slug: "flappybird", name: "Flappy Bird", icon: "🐤", diff: "Çətin", players: "1", color: "text-yellow-300" },
  { slug: "breakout", name: "Breakout", icon: "🧱", diff: "Orta", players: "1", color: "text-pink-400" },
  { slug: "pong", name: "Pong", icon: "🏓", diff: "Asan", players: "2", color: "text-cyan-400" },
  { slug: "2048", name: "2048", icon: "🔢", diff: "Orta", players: "1", color: "text-amber-400" },
  { slug: "tetris", name: "Tetris", icon: "🧩", diff: "Orta", players: "1", color: "text-sky-400" },
  { slug: "simon", name: "Simon Says", icon: "🔴", diff: "Asan", players: "1", color: "text-red-500" },
  { slug: "typing", name: "Typing Speed", icon: "⌨️", diff: "Asan", players: "1", color: "text-indigo-400" },
  { slug: "quiz", name: "Quiz", icon: "❓", diff: "Orta", players: "1", color: "text-violet-400" },
  { slug: "slots", name: "Slot Machine", icon: "🎰", diff: "Asan", players: "1", color: "text-yellow-500" },
];

export default function Home() {
  return (
    <main className="flex-1">
      <div className="relative pt-24 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent animate-pulse" />
        <h1 className="relative text-5xl md:text-7xl font-black mb-4 text-gradient animate-float">GameVault</h1>
        <p className="relative text-lg text-gray-400 max-w-xl mx-auto mb-8">15 klassik oyun – pulsuz, qeydiyyatsız!</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">🎮 15 Oyun</span>
          <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">🆓 Pulsuz</span>
          <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">📱 Mobil</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game, i) => (
          <Link key={game.slug} href={`/games/${game.slug}`} className="game-card animate-card-entry" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="game-icon">{game.icon}</div>
            <h3 className={`text-xl font-bold mb-2 ${game.color}`}>{game.name}</h3>
            <div className="flex gap-2 mt-4">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                game.diff === "Asan" ? "bg-green-500/20 text-green-400" :
                game.diff === "Orta" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>{game.diff}</span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">{game.players} oyunçu</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        © 2026 GameVault • Kənan Göyüşzadə
      </footer>
    </main>
  );
}