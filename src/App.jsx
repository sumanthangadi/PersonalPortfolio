import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NewspaperPortfolio from './components/NewspaperPortfolio';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { initTracker } from './tracking/tracker';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize visitor tracking
  useEffect(() => {
    initTracker();
  }, []);

  useEffect(() => {
    // Preload the single portrait image
    const img = new Image();
    img.src = '/cutouts/mobile.png';
    let imageLoaded = false;

    img.onload = () => { imageLoaded = true; };
    img.onerror = () => { imageLoaded = true; };

    // Editorial progress bar updates
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 40) {
          return prev + Math.floor(Math.random() * 12) + 6;
        } else if (prev < 80) {
          return prev + Math.floor(Math.random() * 6) + 3;
        } else if (prev < 98) {
          if (imageLoaded || document.readyState === 'complete') {
            return prev + Math.floor(Math.random() * 5) + 2;
          }
          return prev;
        } else {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 800);
          }, 250);
          return 100;
        }
      });
    }, 60);

    // Safety timeout of 3.5 seconds
    const safetyTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setIsFadingOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <Routes>
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route
        path="*"
        element={
          <>
            {isLoading && (
              <div className={`loader ${isFadingOut ? 'loader--fading' : ''}`}>
                <div className="loader__title">INDIA TODAY</div>
                <div className="loader__bar">
                  <div
                    className="loader__progress"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="loader__percent">{loadingProgress}%</div>
              </div>
            )}
            <NewspaperPortfolio />
          </>
        }
      />
    </Routes>
  );
}

export default App;

