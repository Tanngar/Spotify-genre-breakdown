import React from 'react';

function Playlist(props) {
  return (
    <React.Fragment>
      <p>Name: {props.name}</p>
      <p>Number of tracks: {props.numOfTracks}</p>
      <hr/>
    </React.Fragment>
  );
}

export default Playlist;
