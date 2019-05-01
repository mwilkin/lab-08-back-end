'use strict';

//--------------------------------
// Load Enviroment Variables from the .env file
//--------------------------------
require('dotenv').config();

//--------------------------------
// Application Dependencies
//--------------------------------
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

//--------------------------------
//Application setup
//--------------------------------
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//--------------------------------
// Error Message
//--------------------------------
let errorMessage = (error, response) => {
  console.error(error);
  if (response) response.status(500).send('internal server error encountered');
};

//--------------------------------
// Constructors Functions
//--------------------------------
function CityLocation(query, data) {
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

//--------------------------------
// Route Callbacks
//--------------------------------
let searchCoords = (request, response) => {
  const data = request.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(result => {
      console.log(result.body);
      response.send(new CityLocation(data, result.body.results[0]));
      console.log(result.body.results[0]);
    })
    .catch(error => errorMessage(error, response));
};

let searchWeather = (request, response) => {
  const data = request.query.data;
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${data.latitude},${data.longitude}`;

  return superagent.get(url)
    .then(result => {
      const weatherSum = result.body.daily.data.map( day => {
        return new Weather(day);
      });
      response.send(weatherSum);
    })
    .catch(error => errorMessage(error, response));
};

//--------------------------------
// Routes
//--------------------------------

app.get('/location', searchCoords);
app.get('/weather', searchWeather);

//--------------------------------
// Power On
//--------------------------------
app.listen(PORT, () => console.log(`app is listening ${PORT}`));
