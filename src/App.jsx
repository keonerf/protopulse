import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FounderVision from './components/FounderVision';
import NarrativeHook from './components/NarrativeHook';
import AssemblyLine from './components/AssemblyLine';
import BusinessCase from './components/BusinessCase';
import SoftwareSuite from './components/SoftwareSuite';
import MediaGallery from './components/MediaGallery';
import Footer from './components/Footer';
import Lenis from 'lenis'; // Import Lenis
import './App.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <FounderVision />
      <NarrativeHook />
      <AssemblyLine />
      <BusinessCase />
      <SoftwareSuite />
      <MediaGallery />
      <Footer />
    </div>
  );
}

export default App;
