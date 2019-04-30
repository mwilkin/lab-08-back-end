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

//--------------------------------
//Application setup
//--------------------------------
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//--------------------------------
// Constructors Functions
//--------------------------------
function Location(query, geoData) {
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Weather(query, weatherData) {
  this.search_query = query;
  this.latitude = query.latitude;
  this.longitude = query.longitude;
  this.forecast = weatherData.daily.data;
}

//--------------------------------
// Route Callbacks
//--------------------------------
let searchCoords = (query) => {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  return location;
};

let searchWeather = (query) => {
  const weatherData = require('./data/darksky.json');
  const weather = new Weather(searchCoords(query), weatherData);
  const weatherArr = [];
  weather.forecast.forEach( (element) => {
    let myDate = new Date(element.time * 1000);
    let newDate = myDate.toDateString();
    let tempObj = {
      forecast: element['summary'],
      time: newDate,
    };
    weatherArr.push(tempObj);
  });

  return weatherArr;
};

//--------------------------------
// Routes
//--------------------------------
app.get('/weather', (request, response) => {
  try {
    const weatherData = searchWeather(request.query.data);
    response.send(weatherData);
  }
  catch(error) {
    console.error(error);
    let message = errorMessage();
    response.status(message.status).send(message.responseText);
  }
});

app.get('/location', (request, response) => {
  try {
    const locationData = searchCoords(request.query.data);
    response.send(locationData);
  }
  catch(error) {
    console.error(error);
    let message = errorMessage();
    response.status(message.status).send(message.responseText);
  }
});

//--------------------------------
// Error Message
//--------------------------------
let errorMessage = () => {
  let errorObj = {
    status: 500,
    responseText: 'Sorry something went wrong',
  };
  console.log(errorObj);
  return errorObj;
};

//--------------------------------
// Power On
//--------------------------------
app.listen(PORT, () => console.log(`app is listening ${PORT}`));
