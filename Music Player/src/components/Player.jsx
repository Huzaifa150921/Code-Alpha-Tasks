// src/components/Player.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Slider, Typography } from '@mui/material';
import '../styles/Player.css';

const Player = ({ currentSong, playlist, onSetCurrentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(progress);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    const currentIndex = playlist.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    onSetCurrentSong(playlist[nextIndex]);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <Box className="player-container" sx={{ p: 3, borderRadius: 8, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" gutterBottom>
        Now Playing: {currentSong.title || "No song selected"}
      </Typography>
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={handleSkip}
      ></audio>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="contained" onClick={handleSkip}>Skip</Button>
      </Box>
      <Slider
        className="progress-bar"
        value={progress}
        aria-labelledby="continuous-slider"
        onChange={(e, value) => setProgress(value)}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="https://img.icons8.com/ios-filled/50/000000/high-volume--v1.png" alt="Volume Icon" className="volume-icon" />
        <Slider
          className="volume-control"
          min={0}
          max={100}
          onChange={(e, value) => (audioRef.current.volume = value / 100)}
        />
      </Box>
    </Box>
  );
};

export default Player;
