import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Playlist from './Playlist.js';

const backendUri = 'http://localhost:3001';

// TODO: refactor this bitch
function PlaylistsList() {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect( () => {
    const playlists = axios({
      method: 'get',
      url: backendUri + '/playlists'
    }).then(playlists => { setPlaylists(playlists.data); });

    const likedSongs = axios({
      method: 'get',
      url: backendUri + '/liked-songs'
    }).then(likedSongs => { setLikedSongs(likedSongs.data); });
  }, []);

  return (
    <React.Fragment>
    <p>{'Name: ' + likedSongs.name}</p>
    <p>{'Number of tracks: ' + likedSongs.numOfTracks}</p>
    <hr/>
    console.log(playlists);
    {playlists.map( playlist => <Playlist key={playlist.id}
                                          name={playlist.name}
                                          numOfTracks={playlist.numOfTracks}/>)}
      </React.Fragment>
    );
  }

  export default PlaylistsList;
