import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Gavel from '@material-ui/icons/Gavel';
import VerifiedUserTwoTone from '@material-ui/icons/VerifiedUserTwoTone';
import Lock from '@material-ui/icons/Lock';

import Error from '../shared/Error';

const LOGIN_MUTATION = gql`
  mutation($username:String!,$password:String!){
    tokenAuth(username:$username,password:$password){
      token
    }
  }
`;

const Login = ({ setNewUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e,tokenAuth, client) => {
    e.preventDefault();
    const res = await tokenAuth();
    client.writeData({
      data: {
        isLoggedIn: true
      }
    });
  }
  return (
    <div style={{
      margin: '40px 20%'
    }}>
      <Paper>
        <Avatar>
          <Lock />
        </Avatar>
        <Typography>
          Login as existing user
        </Typography>
        <Mutation mutation={LOGIN_MUTATION}
          variables={{
            username,
            password
          }}
          onCompleted={(data) => {
            console.log(data.tokenAuth);
            localStorage.setItem('ACCESS_TOKEN', data.tokenAuth.token);
          }}
        >
          {(tokenAuth, { loading, error, called, client }) => {
            return (
              <form onSubmit={(e) => handleSubmit(e, tokenAuth, client)}>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='Username'>Username</InputLabel>
                  <Input id='username' value={username} onChange={({ target }) => setUsername(target.value)} />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='Password'>Password</InputLabel>
                  <Input id='password' type='password' onChange={({ target }) => setPassword(target.value)} value={password} />
                </FormControl>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  disabled={loading || !username.trim() || !password.trim()}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <Button
                  fullWidth
                  variant='contained'
                  color='secondary'
                  style={{
                    marginTop: 15
                  }}
                  onClick={() => setNewUser(true)}
                >
                  New user? Register
                </Button>
                {/* Simple Error Handling */}
                {error && <Error error={error} />}
              </form>
            )
          }}
        </Mutation>
      </Paper>
    </div>
  )
}

export default Login
