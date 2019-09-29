import React, {useContext} from 'react';
import IconButton from '@material-ui/core/IconButton';
import TrashIcon from '@material-ui/icons/DeleteForeverOutlined';

import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { UserContext } from '../../App';
import { GET_TRACKS_QUERY } from '../../pages/Home';

const DELETE_TRACK_MUTATION = gql`
  mutation($trackId:Int!){
     deleteTrack(trackId:$trackId){
       trackId
     }
  }
`;

const DeleteTrack = ({ track }) => {
  const currentUser = useContext(UserContext);
  console.log({ currentUser });
  const isCurrentUser = currentUser.id === track.postedBy.id;
  return isCurrentUser && (
    <Mutation
      mutation={DELETE_TRACK_MUTATION}
      refetchQueries={() => [{
        query: GET_TRACKS_QUERY
      }]}
      variables={{
        trackId:track.id
      }}
      onCompleted={data => {
        console.log(data);
      }}
    >
      {deleteTrack => (
        <IconButton onClick={deleteTrack}>
          <TrashIcon />
        </IconButton>
      )}
    </Mutation>
  )
}

export default DeleteTrack
