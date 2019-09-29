import React, {useState,useContext} from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import axios from 'axios';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import ClearIcon from '@material-ui/icons/Clear';
import { UserContext } from '../../App';
import Error from '../shared/Error';
import { GET_TRACKS_QUERY } from '../../pages/Home';

const UPDATE_TRACK_MUTATION = gql`
   mutation ($title:String!,$description:String!,$url:String!,$trackId:Int!){
     updateTrack(title:$title,description:$description,url:$url,trackId:$trackId){
       track{
         id
         title
         description
       }
     }
   }
`;
const UpdateTrack = ({ track }) => {
  const currentUser = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [file, setFile] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');

  const isCurrentUser = currentUser.id === track.postedBy.id;

  const handleAudioChange = ({ target }) => {
    const selectedFile = target.files[0];
    const fileSizeLimit = 10000000;
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File is too large `);
    }
    else setFile(selectedFile);
  }

  const handleAudioUpload = async () => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('resource_type', 'raw');
      data.append('upload_preset', 'react-tracks');
      data.append('cloud_name', 'weaddstudio');

      const { data: response } = await axios.post('https://api.cloudinary.com/v1_1/weaddstudio/raw/upload', data);
      return response.url;
    } catch (error) {
      console.error('UPLOAD_ERROR', error);
      setSubmitting(false);
    }

  }

  const handleSubmit = async (e, updateTrack) => {
    e.preventDefault();
    setSubmitting(true);
    // Upload an audio file, get the URL from API
    const uploadedUrl = await handleAudioUpload();
    await updateTrack({
      variables: {
        title,
        description,
        url: uploadedUrl,
        trackId:track.id
      }
    });
  }

  return isCurrentUser && (
    <div>
      {/* Create Track Button */}

      <IconButton
        onClick={() => setOpen(true)}
      >
        {open ? <ClearIcon style={{ color: '#fff' }} /> : (
          <EditIcon
            // style={{
            // color: '#fff'
            // }}
          />
        )}

      </IconButton>

      {/* Create Track dialog */}

      <Mutation
        mutation={UPDATE_TRACK_MUTATION}
        onCompleted={() => {
          setOpen(false);
          setSubmitting(false);
          setTitle('');
          setDescription('');
          setFile('');
        }}
        refetchQueries={() => [{
          query: GET_TRACKS_QUERY
        }]}
      >
        {(updateTrack, { loading, error }) => {
          if (error) return <Error error={error} />;
          return (
            <Dialog open={open}>
              <form onSubmit={e => handleSubmit(e, updateTrack)}>
                <DialogTitle>Update Track</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a title, Description & Audio File (10 MB max)
            </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label='Title'
                      placeholder='Add Title'
                      value={title}
                      onChange={({ target }) => setTitle(target.value)}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      label='Description'
                      placeholder='Add Description'
                      multiline
                      rows={3}
                      value={description}
                      onChange={({ target }) => setDescription(target.value)}
                    />
                  </FormControl>
                  <FormControl error={!!fileError}>
                    <input
                      type="file"
                      required
                      id='audio'
                      style={{
                        visibility: 'hidden'
                      }}
                      accept='audio/mp3,audio/wav'
                      onChange={handleAudioChange}
                    />
                    <label htmlFor="audio">
                      <Button
                        variant='outlined'
                        color={file ? 'secondary' : 'inherit'}
                        component='span'
                        style={{
                          marginRight: 20
                        }}
                      >
                        AUdio File &nbsp; &nbsp;
                  <LibraryMusicIcon />
                      </Button>
                      {file && file.name}
                      <FormHelperText>{fileError}</FormHelperText>
                    </label>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpen(false)}
                    disabled={!!submitting}
                  >
                    Cancel
           </Button>
                  <Button
                    color='primary'
                    type='submit'
                    disabled={!title.trim() || !description.trim() || !file || !!submitting}
                  >
                    {submitting ? (
                      <CircularProgress />
                    ) : 'Save'}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          )
        }}
      </Mutation>

    </div>
  );
}

export default UpdateTrack
