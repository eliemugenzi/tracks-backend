import React, {useState, useRef} from 'react';
import { ApolloConsumer } from 'react-apollo';
import { gql } from 'apollo-boost';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


const SEARCH_TRACKS_QUERY = gql`
  query($search:String){
    tracks(search:$search){
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
`;
const SearchTracks = ({setSearchResults}) => {

  const [search, setSearch] = useState('');
  const inputEl = useRef();

  const clearSearchInput = () => {
    setSearchResults([]);
    setSearch('');
    inputEl.current.focus();
  }

  const handleSubmit = async (e, client) => {
    e.preventDefault();
    const res=await client.query({
      query: SEARCH_TRACKS_QUERY,
      variables: { search }
    });
    
    setSearchResults(res.data.tracks);
  }

  return (
    <ApolloConsumer>
      {(client) => {
        return (
          <form onSubmit={e=>handleSubmit(e,client)}>
            <Paper elevation={1} style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '20px 10%'
            }}>
              <IconButton onClick={clearSearchInput}>
                <ClearIcon />
              </IconButton>
              <TextField
                fullWidth
                placeholder='Search all tracks'
                InputProps={{
                  disableUnderline: true
                }}
                style={{
                  transform: 'translateY(10px)'
                }}
                value={search}
                onChange={({ target }) => setSearch(target.value)}
                inputRef={inputEl}
              />
              <IconButton type='submit'>
                <SearchIcon />
              </IconButton>
            </Paper>
          </form>
        );
      }}
    </ApolloConsumer>
  );
}

export default SearchTracks
