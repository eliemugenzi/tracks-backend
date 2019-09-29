import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AudioPlayer from '../shared/AudioPlayer';
import LikeTrack from './LikeTrack';
import DeleteTrack from './DeleteTrack';
import UpdateTrack from './UpdateTrack';

const TrackList = ({tracks}) => {
  return (
    <List>
      {tracks.map(track => (
        <ExpansionPanel key={track.id} style={{
          margin:'5px 10%'
        }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem>
            <LikeTrack />
            <ListItemText
                primary={track.title}
                style={{
                  marginLeft: 50,
                  fontSize:25
                }}
              secondary={
                <Link to={`/profiles/${track.postedBy.id}`} style={{
                  textDecoration: 'none',
                  color:'#333'
                }}>
                  Uploaded by <i style={{ color:'#3B81E5'}}>{track.postedBy.username}</i>
                </Link>
              }
              primaryTypographyProps={{
                variant: 'subheading',
                color:'primary'
              }}
            />
            <AudioPlayer url={track.url} />
            </ListItem>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography variant='body1'>
            {track.description}
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <UpdateTrack track={track} />
            <DeleteTrack track={track} />
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </List>
  )
}

export default TrackList;
