import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FounderVision from './components/FounderVision';
import NarrativeHook from './components/NarrativeHook';
import AssemblyLine from './components/AssemblyLine';
import BusinessCase from './components/BusinessCase';
import Roadmap from './components/Roadmap';
import ComponentRepo from './components/ComponentRepo';
import MediaGallery from './components/MediaGallery';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <FounderVision />
      <NarrativeHook />
      <AssemblyLine />
      <BusinessCase />
      <Roadmap />
      <ComponentRepo />
      <MediaGallery />
      <Footer />
    </div>
  )
}

export default App;
