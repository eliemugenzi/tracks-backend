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

  const handleUpdateCache = (cache, {data:{deleteTrack}}) => {
    const data=cache.readQuery({
      query: GET_TRACKS_QUERY
    });
    const index=data.tracks.findByIndex(
      track => Number(track.id) === deleteTrack.trackId
    );
    // data.tracks.splice(index, 1);

    const tracks = [...data.tracks.slice(0, index), ...data.tracks.slice(index + 1)];
    cache.writeQuery({
      query: GET_TRACKS_QUERY,
      data: {
        tracks
      }
    })
  }
  return isCurrentUser && (
    <Mutation
      mutation={DELETE_TRACK_MUTATION}
      // refetchQueries={() => [{
      //   query: GET_TRACKS_QUERY
      // }]}
      variables={{
        trackId:track.id
      }}
      onCompleted={data => {
        console.log(data);
      }}
      update={handleUpdateCache}
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
