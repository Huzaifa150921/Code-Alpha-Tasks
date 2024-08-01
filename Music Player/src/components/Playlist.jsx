// src/components/Playlist.jsx
import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, TextField } from '@mui/material';

const Playlist = ({ playlist, onSelectSong }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the playlist based on the search term
  const filteredPlaylist = playlist.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="playlist-container" sx={{ p: 3, borderRadius: 8, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2>Playlist</h2>
      <TextField
        className="search-input"
        type="text"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <List className="song-list">
        {filteredPlaylist.map((song) => (
          <ListItem
            key={song.id}
            className="song"
            onClick={() => onSelectSong(song)}
            button
          >
            <ListItemText primary={song.title} secondary={song.artist} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Playlist;
