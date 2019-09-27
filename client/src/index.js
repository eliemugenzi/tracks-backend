import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient, { gql } from 'apollo-boost';
import './index.css';
import App from './App';
import Auth from './components/auth';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
  clientState: {
    defaults: {
      isLoggedIn: !!localStorage.getItem('ACCESS_TOKEN')
    }
  },
  fetchOptions: {
    credentials:'include'
  },
  request: operation => {
    const token = localStorage.getItem('ACCESS_TOKEN') || '';
    operation.setContext({
      headers: {
        Authorization:`JWT ${token}`
      }
    })
  }
});

const IS_LOGGED_IN_QUERY = gql`
  {
    isLoggedIn @client
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN_QUERY}>
      {({data})=>data.isLoggedIn?<App /> : <Auth />}
    </Query>
  </ApolloProvider>
  , document.getElementById('root'));
