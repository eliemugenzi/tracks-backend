import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import logo from './logo.svg';
import './App.css';

const GET_TRACKS_QUERY = gql`
 {
   tracks {
     title
     description
     url
   }
 }
`;

const ME_QUERY = gql`
{
  me{
    id
    username
    email
  }
}
`;
function App() {
  return (
    <Query query={ME_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>Error</div>
        return <div>
          {JSON.stringify(data)}
        </div>
      }}
    </Query>
  );
}

export default App;
