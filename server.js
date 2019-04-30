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

function Location(query, geoData) {
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
};


//Helper Function
let searchCoords = (query) => {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  console.log(location);
  return location;
};

app.listen(PORT, () => console.log(`app is listening ${PORT}`));
