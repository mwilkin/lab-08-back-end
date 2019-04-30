'use strict';

//Load Enviroment Variables from the .env file
require('dotenv').config();

//Application Dependencies
const express = require('express');
const cors = require('cors');

//Application setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//API Routes
app.get('/location', (request, response) => {
  try {
    const locationData = searchCoords(request.query.data);
    response.send(locationData);
  }
  catch(error) {
    console.error(error);
    response.status(500).send('Status: 500. You suck. User error');
  }
});

//Helper Function
let searchCoords = (query) => {
  const geoDate = require('./data/geo.json');
  const location = {
    search_query: query,
    formatted_query: geoData.results[0].formatted_address,
    latitude: geoData.results[0].geometry.location.lat,
    longitude: geoData.results[0].geometry.location.lng

  };
  return location;
}

app.listen(PORT, () => console.log(`app is listening ${PORT}`));
