import React, {useState} from 'react';
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

// Some components

import Error from '../shared/Error';

const REGISTER_MUTATION = gql`
  mutation($username:String!,$email:String!,$password:String!){
    createUser(username:$username,email:$email,password:$password){
      user{
        email
        username
      }
    }
  }
`;

const Transition = props => {
  return <Slide direction='up' {...props} />;
}

const Register = ({setNewUser}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e, createUser) => {
    e.preventDefault();
    console.log('Hi there');

    // Alternatively 

    // createUser({
    //   variables: {
    //     username,
    //     email,
    //     password
    //   }
    // });

    const res = await createUser();
    console.log(res);
  }
  return (
    <div style={{
      margin:'40px 20%'
    }}>
      <Paper>
        <Avatar>
          <Gavel />
        </Avatar>
        <Typography>
          Register
        </Typography>
        <Mutation mutation={REGISTER_MUTATION}
          variables={{
            username,
            email,
            password
          }}
          onCompleted={(data)=>setOpen(true)}
        >
          {(createUser,{loading,error}) => {
            return (
              <form onSubmit={(e)=>handleSubmit(e,createUser)}>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='Username'>Username</InputLabel>
                  <Input id='username' value={username} onChange={({target})=>setUsername(target.value)} />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='Email'>Email</InputLabel>
                  <Input id='email' type='email' value={email} onChange={({target})=>setEmail(target.value)} />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='Password'>Password</InputLabel>
                  <Input id='password' type='password' onChange={({target})=>setPassword(target.value)} value={password} />
                </FormControl>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='secondary'
                  disabled={ loading || !username.trim() || !email.trim() || !password.trim() }
                >
                  {loading? 'Registering...' : 'Register'}
                  </Button>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            style={{
              marginTop:15
            }}
                  onClick={()=>setNewUser(false)}
          >
                  Previous user? Login
                </Button>
                {/* Simple Error Handling */}
                {error && <Error error={error} /> }
              </form>
            )
          }}
        </Mutation>
      </Paper>
      {/* Success dialog */}

      <Dialog 
        disableBackdropClick={true}
        open={open}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone />
          New Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText>User successfully created</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='primary'
            onClick={()=>setNewUser(false)}
          >
          Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Register
