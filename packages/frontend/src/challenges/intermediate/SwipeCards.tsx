export default function SwipeCards() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Swipe Cards</h1>
        <p className="text-gray-300 mb-4">Placeholder: Swipeable card interface (Tinder-style)</p>
        import { useState } from 'react';

interface Card {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
}

export default function SwipeCards() {
  const initialCards: Card[] = [
    { id: 1, title: 'React', description: 'A JavaScript library for building user interfaces', image: '⚛️', color: 'from-blue-500 to-cyan-500' },
    { id: 2, title: 'TypeScript', description: 'Typed superset of JavaScript', image: '📘', color: 'from-blue-600 to-blue-800' },
    { id: 3, title: 'Playwright', description: 'E2E testing framework', image: '🎭', color: 'from-green-500 to-emerald-600' },
    { id: 4, title: 'Tailwind CSS', description: 'Utility-first CSS framework', image: '🎨', color: 'from-cyan-500 to-blue-500' },
    { id: 5, title: 'Vite', description: 'Next generation frontend tooling', image: '⚡', color: 'from-purple-500 to-pink-500' },
  ];

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [liked, setLiked] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    setSwipeDirection(direction);

    if (direction === 'right') {
      setLiked([...liked, currentCard.id]);
    } else {
      setRejected([...rejected, currentCard.id]);
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const reset = () => {
    setCards(initialCards);
    setCurrentIndex(0);
    setLiked([]);
    setRejected([]);
    setSwipeDirection(null);
  };

  const currentCard = cards[currentIndex];
  const hasCards = currentIndex < cards.length;

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Swipe Cards</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="liked-count">{liked.length}</p>
          <p className="text-sm text-green-700 dark:text-green-400">Liked ❤️</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="rejected-count">{rejected.length}</p>
          <p className="text-sm text-red-700 dark:text-red-400">Rejected ✕</p>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[500px] mb-6" data-testid="card-stack">
        {!hasCards ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600" data-testid="no-cards">
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No more cards!</p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
              data-testid="reset-button"
            >
              Reset Cards
            </button>
          </div>
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentCard.color} rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
              swipeDirection === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : ''
            } ${
              swipeDirection === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''
            }`}
            data-testid={`card-${currentCard.id}`}
          >
            <div className="text-8xl mb-6">{currentCard.image}</div>
            <h3 className="text-3xl font-bold text-white mb-3">{currentCard.title}</h3>
            <p className="text-lg text-white/90 text-center">{currentCard.description}</p>
            <div className="mt-6 text-sm text-white/75">
              Card {currentIndex + 1} of {cards.length}
            </div>
          </div>
        )}
      </div>

      {/* Swipe Buttons */}
      {hasCards && (
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleSwipe('left')}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center text-3xl"
            data-testid="reject-button"
          >
            ✕
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-20 h-20 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center text-3xl"
            data-testid="like-button"
          >
            ❤️
          </button>
        </div>
      )}

      {/* Testing Hints */}
      <div className="mt-8 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use <code className="bg-gray-800 px-1 rounded">page.mouse.move()</code> to simulate swipe gestures</li>
          <li>• Test swipe left (reject) and swipe right (like) buttons</li>
          <li>• Verify card removal animation</li>
          <li>• Test on mobile viewport for touch events</li>
          <li>• Verify liked/rejected counts update correctly</li>
          <li>• Test reset functionality after all cards are swiped</li>
        </ul>
      </div>
    </div>
  );
}
      </div>
    </div>
  );
}
