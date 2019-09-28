import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import { ApolloConsumer } from 'react-apollo';

const Signout = () => {

  const handleSignout = client => {
    localStorage.clear();
    client.writeData({
      data: {
        isLoggedIn: false
      }
    });
    console.log('Signed out User', client);
  }

  return (
    <ApolloConsumer>
      {(client) => (
        <Button onClick={()=>handleSignout(client)}>
          <Typography color='secondary'>
            Sign Out
      </Typography>
          <ExitToApp />
        </Button>
      )}
    </ApolloConsumer>
  )
}

export default Signout;
