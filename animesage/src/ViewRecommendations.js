import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, Button,Typography, CircularProgress, Grow, Chip, Rating, Link } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
// require('dotenv').config()
const ViewRecommendations = () => {
  const location = useLocation();
  const formValues = location.state?.formValues || null;
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (formValues) {
      fetchRecommendations(formValues);
    }
  }, [formValues]);
  const handleEmailButtonClick = (recommendation) => {
  
    // Create the JSON payload to send in the POST request
    const payload = {
      title: recommendation.title?.S || '',
      synopsis: recommendation.synopsis?.S || '',
      episodes: recommendation.episodes?.N || 0,
      ranked: recommendation.ranked?.N || 0,
      popularity: recommendation.popularity?.N || 0,
      score: recommendation.score?.N || 0.0,
      genre: recommendation.genre?.SS || [],
      members: recommendation.members?.N || 0,
      img_url: recommendation.img_url?.S || '',
      link: recommendation.link?.S || '',
      aired: recommendation.aired?.S || ''
    };
  
    // Send the POST request
    fetch(`${process.env.REACT_APP_API}/sendanimesns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  const fetchRecommendations = async (formData) => {
    try {
      setIsLoading(true);
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

      const data = await response.json();
      setRecommendations(data); 
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setIsLoading(false);
    }
  };

  const truncateSynopsis = (text, maxLines) => {
    const lines = text.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + '...';
    }
    return text;
  };

  return (
    <div>
      <h1>View Recommendations</h1>
      <Grid container spacing={2}>
        {isLoading ? (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        ) : (
          recommendations.map((recommendation) => (
            <Grid key={recommendation.uid.S} item xs={12} sm={6} md={4} lg={3}>
              <Grow in>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <img src={recommendation.img_url?.S || ''} alt={recommendation.title?.S || 'No Image'} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    <Typography variant="h5" component="h2">
                      {recommendation.title?.S || 'Title not available'}
                    </Typography>
                    <Typography variant="body2" component="p" style={{ whiteSpace: 'pre-wrap' }}>
                      {truncateSynopsis(recommendation.synopsis?.S || 'Synopsis not available', 4)}
                      {recommendation.synopsis?.S && recommendation.synopsis.S.split('\n').length > 4 && (
                        <Link
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            console.log('See more clicked:', recommendation.synopsis.S);
                          }}
                        >
                          {' See more'}
                        </Link>
                      )}
                    </Typography>
                    <Chip label={`Episodes: ${recommendation.episodes?.N || 'N/A'}`} />
                    <Chip label={`Ranked: ${recommendation.ranked?.N || 'N/A'}`} />
                    <Chip label={`Popularity: ${recommendation.popularity?.N || 'N/A'}`} />
                    <Rating
                      name={`score-${recommendation.uid?.S}`}
                      value={recommendation.score?.N ? parseFloat(recommendation.score.N) : null}
                      precision={0.5}
                      emptyIcon={<StarIcon style={{ color: 'lightgrey' }} />}
                    />
                    {recommendation.genre?.SS && (
                      <div>
                        {recommendation.genre.SS.map((genre) => (
                          <Chip key={genre} label={genre} style={{ margin: 2 }} />
                        ))}
                      </div>
                    )}
                     <Button
                      variant="outlined"
                      onClick={() => handleEmailButtonClick(recommendation)}
                      style={{ marginTop: '8px' }}
                    >
                      Get details via Email
                    </Button>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default ViewRecommendations;
