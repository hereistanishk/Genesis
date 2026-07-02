import { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { RotateCcw } from 'lucide-react';

const PIECE_SYMBOLS: Record<string, Record<string, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, boolean>>({});

  const onSquareClick = (square: Square) => {
    if (game.isGameOver()) return;

    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const move = moves.find((m) => m.to === square);

      if (move) {
        const newGame = new Chess(game.fen());
        newGame.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });
        setGame(newGame);
        setSelectedSquare(null);
        setOptionSquares({});
        return;
      }
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setOptionSquares({});
        return;
      }
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      const newOptionSquares: Record<string, boolean> = {};
      moves.forEach((m) => {
        newOptionSquares[m.to] = true;
      });
      setOptionSquares(newOptionSquares);
    } else {
      setSelectedSquare(null);
      setOptionSquares({});
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setOptionSquares({});
  };

  const board = game.board(); // 8x8 array
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // Game Status
  let status = '';
  if (game.isCheckmate()) {
    status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
  } else if (game.isDraw()) {
    status = 'Draw!';
  } else {
    status = `${game.turn() === 'w' ? 'White' : 'Black'}'s Turn`;
    if (game.isCheck()) {
      status += ' (Check)';
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans text-stone-900">
      <div className="max-w-[480px] w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Genesis</h1>
            <p className="text-stone-500">{status}</p>
          </div>
          <button
            onClick={resetGame}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Board */}
        <div className="aspect-square w-full shadow-sm ring-1 ring-stone-900/10 rounded-sm overflow-hidden flex flex-col">
          {board.map((row, i) => {
            const rank = 8 - i;
            return (
              <div key={rank} className="flex-1 flex">
                {row.map((piece, j) => {
                  const file = files[j];
                  const square = `${file}${rank}` as Square;
                  const isDark = (i + j) % 2 !== 0;
                  
                  const isSelected = selectedSquare === square;
                  const isOption = optionSquares[square];

                  return (
                    <button
                      key={square}
                      onClick={() => onSquareClick(square)}
                      className={`flex-1 flex items-center justify-center relative select-none
                        ${isDark ? 'bg-stone-300' : 'bg-stone-100'}
                        ${isSelected ? 'bg-amber-200/80' : ''}
                        hover:opacity-90 transition-colors focus:outline-none
                        text-[2.5rem] sm:text-[3rem] leading-none
                      `}
                    >
                      {/* Coordinates */}
                      {j === 0 && (
                        <span className={`absolute top-0.5 left-1 text-[10px] font-medium opacity-50`}>
                          {rank}
                        </span>
                      )}
                      {i === 7 && (
                        <span className={`absolute bottom-0.5 right-1 text-[10px] font-medium opacity-50`}>
                          {file}
                        </span>
                      )}

                      {/* Highlight dot for possible moves */}
                      {isOption && !piece && (
                        <div className="absolute w-3 h-3 rounded-full bg-stone-900/20" />
                      )}
                      
                      {/* If option and there's a piece (capture), add a ring instead */}
                      {isOption && piece && (
                        <div className="absolute inset-0 ring-[3px] ring-inset ring-stone-900/20 rounded-full m-1" />
                      )}

                      {/* Piece */}
                      {piece && (
                        <span className={`z-10 drop-shadow-sm ${piece.color === 'w' ? 'text-stone-900' : 'text-stone-900'}`}>
                          {PIECE_SYMBOLS[piece.color][piece.type]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
