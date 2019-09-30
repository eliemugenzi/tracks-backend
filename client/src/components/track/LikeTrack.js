import React, {useContext} from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import { GET_TRACKS_QUERY } from '../../pages/Home';
import { UserContext, ME_QUERY } from '../../App';

const LIKE_MUTATION = gql`
  mutation($trackId:Int!){
    createLike(trackId:$trackId){
      user{
        username
      }
      track{
        title
        description
        postedBy{
          username
        }
      }
    }
  }
`;

const LikeTrack = ({ trackId, likeCount }) => {
  const currentUser = useContext(UserContext);
  const handleDisableLikedTrack = () => {
    const likes = currentUser.likeSet;
    const isLiked = likes.findIndex(({ track }) => track.id === trackId) > -1;
    return isLiked;
  }
  return (
    <Mutation
      mutation={LIKE_MUTATION}
      variables={{
        trackId
      }}
      refetchQueries={() => [{
        query: GET_TRACKS_QUERY
      },
        {
        query:ME_QUERY
      }]}
    >
      {createLike => {
        return (
          <IconButton
            onClick={e => {
              e.stopPropagation();
              createLike();
            }}
          disabled={handleDisableLikedTrack()}
          >
            <span style={{
              fontSize: 18,
              marginRight:20
            }}>{likeCount}</span>
            <ThumbUpIcon />
          </IconButton>
        )
      }}

    </Mutation>
  )
}

export default LikeTrack;
