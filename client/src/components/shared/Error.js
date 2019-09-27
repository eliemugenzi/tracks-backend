import React, {useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const Error = ({ error }) => {
  const [open, setOpen] = useState(true);
  return (
    <Snackbar
      message={error.message}
      open={open}
      action={
        <Button
          color='secondary'
          size='small'
          onClick={()=>setOpen(false)}
        >
          Close
        </Button>
      }
    />
  )
}

export default Error;
