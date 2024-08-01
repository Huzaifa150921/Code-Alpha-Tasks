// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Player from './components/Player';
import Playlist from './components/Playlist';
import Search from './components/Search';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState({});
  const playlist = [
    { id: 1, title: 'Song 1', artist: 'Artist 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Song 2', artist: 'Artist 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Song 3', artist: 'Artist 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Player
                  currentSong={currentSong}
                  playlist={playlist}
                  onSetCurrentSong={setCurrentSong}
                />
                <Playlist
                  playlist={playlist}
                  onSelectSong={handleSelectSong}
                />
              </>
            }
          />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
