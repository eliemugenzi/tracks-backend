import React from 'react';
import ReactPlayer from 'react-player';

const AudioPlayer = ({url}) => {
  return (
    <div>
      <ReactPlayer
        height='30px'
        width='500px'
        url={url}
        controls
       />
    </div>
  )
}

export default AudioPlayer;
