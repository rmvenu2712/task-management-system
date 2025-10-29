import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface CelebrationEffectProps {
  onComplete: () => void;
}

export const CelebrationEffect = ({ onComplete }: CelebrationEffectProps) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
      />
      <div className="text-9xl animate-bounce pointer-events-none">
        🎉
      </div>
    </div>
  );
};
