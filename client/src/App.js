import React,{createContext} from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Header from './components/shared/Header';
import Loading from './components/shared/Loading';
import Error from './components/shared/Error';

export const UserContext = createContext();

const GET_TRACKS_QUERY = gql`
 {
   tracks {
     title
     description
     url
   }
 }
`;

export const ME_QUERY = gql`
{
  me{
    id
    username
    email
    likeSet{
      track{
        id
        title
      }
    }
  }
}
`;
function App() {
  return (
    <Query
      query={ME_QUERY}
      fetchPolicy='cache-and-network'
    >
      {({ data, loading, error }) => {
        if (loading) return <Loading />
        if (error) return <Error error={error} />
        const currentUser = data.me;

        return (
          <Router>
            <UserContext.Provider value={currentUser}>
              <Header currentUser={currentUser} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/profiles/:id' component={Profile} />
              </Switch>
              </UserContext.Provider>
          </Router>
          )
      }}
    </Query>
  );
}

export default App;
