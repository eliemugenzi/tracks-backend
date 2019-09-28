import React, {useState} from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import SearchTracks from '../components/track/SearchTracks';
import TrackList from '../components/track/TrackList';
import CreateTrack from '../components/track/CreateTrack';
import Loading from '../components/shared/Loading';
import Error from '../components/shared/Error';

export const GET_TRACKS_QUERY = gql`
  {
    tracks{
      id
      title
      description
      url
      likes{
        id
      }
      postedBy{
        id
        username
      }
    }
  }
`;

const Home = () => {
  
  const [searchResults,setSearchResults]=useState([]);
  

  return (
    <div>
      <SearchTracks setSearchResults={setSearchResults} />
      <CreateTrack />
      <Query query={GET_TRACKS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />;
          
          const tracks = searchResults.length > 0 ? searchResults : data.tracks;

          return <TrackList tracks={tracks} />
        }}
      </Query>
    </div>
  )
}

export default Home;
