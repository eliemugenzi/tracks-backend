import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'grid',
      placeContent:'center'
    }}>
      <CircularProgress />
    </div>
  )
}

export default Loading;
