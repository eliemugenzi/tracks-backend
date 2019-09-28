import React from 'react';
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
        if (loading) return <Loading />
        if (error) return <Error error={error} />
        const currentUser = data.me;

        return (
          <Router>
            <>
              <Header currentUser={currentUser} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/profiles/:id' component={Profile} />
              </Switch>
              </>
          </Router>
          )
      }}
    </Query>
  );
}

export default App;
