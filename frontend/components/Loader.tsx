import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoaderProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function Loader({ 
  message, 
  duration = 2000, // ⏱ stays visible for full 2 seconds
  onComplete 
}: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out *after* duration (2s)
    const timer = setTimeout(() => {
      setFadeOut(true);
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 500); // fade duration
      return () => clearTimeout(fadeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <DotLottieReact
        src="https://lottie.host/11ec582e-a6a6-4009-9c7f-7dc555565cab/eDPWxNMbM5.lottie"
        loop
        autoplay
        style={{ width: 480, height: 480 }}
      />
      {message && <p className="mt-4 text-gray-700 text-sm">{message}</p>}
    </div>
  );
}
