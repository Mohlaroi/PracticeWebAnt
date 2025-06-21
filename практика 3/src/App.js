import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import './assets/css/general.css';
import './assets/css/locations.css';
import './assets/css/episodes.css';
import './assets/css/details.css';
import LocationsPage from './pages/LocationsPage';
import CharactersPage from './pages/CharactersPage';
import EpisodesPage from './pages/EpisodesPage';
import CharacterDetailsPage from './pages/CharacterDetailsPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import EpisodeDetailsPage from './pages/EpisodeDetailsPage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/characters" replace />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/episodes" element={<EpisodesPage />} />
        <Route path="/characters/:id" element={<CharacterDetailsPage />} />
        <Route path="/locations/:id" element={<LocationDetailsPage />} />
        <Route path="/episodes/:id" element={<EpisodeDetailsPage />} />
        {}
        <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '2rem' }}>404 — Страница не найдена</h2>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
