import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';


const AnimeFilterForm = () => {
  console.log(process.env)
  const api_url = process.env.REACT_APP_API;
  const [aired, setAired] = useState(null);
  const [episodes, setEpisodes] = useState('');
  const [popularity, setPopularity] = useState('');
  const [ranked, setRanked] = useState('');
  const [score, setScore] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Fetch genre data from the API on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log(api_url)
        const response = await fetch(`${process.env.REACT_APP_API}/genres`);
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, [api_url]);

  const navigate = useNavigate();

  const handleFilter = async (event) => {
    event.preventDefault();
    setIsFiltering(true);

    // Create a JSON object with all the form data
    const formData = {
      aired,
      episodes,
      popularity,
      ranked,
      score,
      genres: selectedGenres,
    };

    // Log the form data to the console in JSON format
    console.log(JSON.stringify(formData, null, 2));

    try {
      // Send the form data as a POST request to the API
      const response = await fetch(`${process.env.REACT_APP_API}/filteranime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // Redirect to the recommendations page
      navigate('/recommendations', { state: { formValues: formData } });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleGenreChange = (event) => {
    setSelectedGenres(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleFilter}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Aired"
              value={aired}
              onChange={(newValue) => setAired(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth InputProps={{ startAdornment: <SearchIcon /> }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Episodes"
              fullWidth
              value={episodes}
              onChange={(e) => setEpisodes(e.target.value)}
              type="number"
              inputProps={{ inputMode: 'numeric' }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Popularity"
              fullWidth
              value={popularity}
              onChange={(e) => setPopularity(e.target.value)}
              type="number"
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ranked"
              fullWidth
              value={ranked}
              onChange={(e) => setRanked(e.target.value)}
              type="number"
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Score"
              fullWidth
              value={score}
              onChange={(e) => setScore(e.target.value)}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0, max: 10, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Dropdown with checkboxes for genres */}
            <TextField
              select
              label="Genre"
              fullWidth
              SelectProps={{
                multiple: true,
                value: selectedGenres,
                onChange: handleGenreChange,
                renderValue: (selected) => selected.join(', '),
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  <Checkbox checked={selectedGenres.indexOf(genre) > -1} />
                  <ListItemText primary={genre} />
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={isFiltering}>
            {isFiltering ? <RefreshIcon sx={{ animation: 'spin 1s infinite' }} /> : 'Filter'}
          </Button>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default AnimeFilterForm;
