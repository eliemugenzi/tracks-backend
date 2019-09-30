import React, {useState} from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import Error from '../shared/Error';
import { GET_TRACKS_QUERY } from '../../pages/Home';

const CREATE_TRACK_MUTATION = gql`
   mutation ($title:String!,$description:String!,$url:String!){
     createTrack(title:$title,description:$description,url:$url){
       track{
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
   }
`;

const CreateTrack = () => {

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');

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

  const handleSubmit=async (e,createTrack)=>{
    e.preventDefault();
    setSubmitting(true);
    // Upload an audio file, get the URL from API
    const uploadedUrl=await handleAudioUpload();
    await createTrack({
      variables: {
        title,
        description,
        url:uploadedUrl
      }
    });
  }

  const handleUpdateCache = (cache, {data:{createTrack}}) => {
    const data=cache.readQuery({
      query:GET_TRACKS_QUERY
    });
    const tracks=data.tracks.concat(createTrack.track);
    cache.writeQuery({
      query: GET_TRACKS_QUERY,
      data: {
        tracks
      }
    });
  }

  return (
    <div>
      {/* Create Track Button */}

      <Button variant='fab' color='secondary' style={{
        position: 'absolute',
        bottom: 50,
        right: 50,
        borderRadius: 20,
        width: 40,
        height: 40,
        backgroundColor:'#3B81E5'
      }}
      onClick={()=>setOpen(true)}
      >
        {open ? <ClearIcon style={{color:'#fff'}} /> : (
          <AddIcon style={{
            color: '#fff'
          }} />
        ) }
        
      </Button>

      {/* Create Track dialog */}
       
      <Mutation
        mutation={CREATE_TRACK_MUTATION}
        onCompleted={() => {
          setOpen(false);
          setSubmitting(false);
          setTitle('');
          setDescription('');
          setFile('');
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{
        //   query:GET_TRACKS_QUERY
        // }]}
      >
        {(createTrack, { loading, error }) => {
          if (error) return <Error error={error} />;
          return (
            <Dialog open={open}>
              <form onSubmit={e=>handleSubmit(e,createTrack)}>
                <DialogTitle>Create Track</DialogTitle>
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
  )
}

export default CreateTrack;
