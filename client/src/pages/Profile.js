import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ThumbUpIcon from '@material-ui/icons/ThumbUpTwoTone';
import AudioTrackIcon from '@material-ui/icons/AudiotrackTwoTone';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import format from 'date-fns/format';

import AudioPlayer from '../components/shared/AudioPlayer';
import Error from '../components/shared/Error';
import Loading from '../components/shared/Loading';

const GET_USER_QUERY = gql`
 query($id:Int!){
    user(id:$id){
    id
    username
    email
    dateJoined
    likeSet{
      track{
        id
        title
        description
        url
        postedBy{
          username
        }
        likes{
          id
        }
      }
    }
    trackSet{
      id
      title
      description
      url
      likes{
        id
        user{
          username
        }
      }
      postedBy{
        id
        username
      }
    }
  }
 }
`;
const Profile = ({match:{params}}) => {
  return (
    <Query query={GET_USER_QUERY}
      variables={{
        id:params.id
      }}
      onCompleted={data => {
        console.log('DATA', data);
      }}
    >
      {({data, loading, error}) => {
        console.log(data)
        if (loading) return <Loading />;
        if (error) return <Error error={error} />
        return (
          <>
            {/* User Info Card */}
            <Card>
              <CardHeader
                avatar={<Avatar>{data.user.username[0]}</Avatar>}
                title={data.user.username}
                subheader={`Joined ${data.user.dateJoined}`}
              />
            </Card>
            {/* Created Tracks */}
            <Paper elevation={1}>
              <Typography variant='title' style={{
                margin: 'auto 10%',
                fontSize:25
              }}>
                <AudioTrackIcon /> &nbsp;
                Created Tracks
              </Typography>
              {data.user.trackSet.map(track => {
                return (
                  <div key={track.id} style={{
                    margin: '20px 10%',
                  }}>
                    <Typography style={{
                      marginBottom:10
                    }}>
                      {track.title} . {track.likes.length} Likes
                    </Typography>
                    <AudioPlayer url={track.url} />
                    <br />
                    <Divider />
                  </div>
                )
              })}

              {/* Liked Tracks */}
              <Paper elevation={1}>
                <Typography variant='title' style={{
                  margin: 'auto 10%',
                  fontSize:25
                }}>
                  <ThumbUpIcon /> &nbsp;
                   Liked Tracks
                </Typography>
                {data.user.likeSet.map(({track}) => {
                  console.log('TRACK', track);
                  return (
                    <div key={track.id} style={{
                      margin: '20px 10%',
                      display:'block'
                    }}>
                      <Typography style={{
                        marginBottom:10
                      }}>
                        {track.title} . {track.likes.length} Likes . {track.postedBy.username}
                      </Typography>
                      <AudioPlayer url={track.url} />
                      <br />
                      <Divider />
                    </div>
                  )
                })}
              </Paper>
            </Paper>
          </>
        );
      }}
    </Query>
  )
}

export default Profile;
