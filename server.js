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
const PORT = process.env.PORT;
const app = express();
app.use(cors());

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
// Constructors Functions
//--------------------------------
function Location(query, data) {
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
      response.send(new Location(data, result.body.results[0]));
    })
    .catch(error => handleError(error, response));
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

app.get('/location', searchCoords);



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




//--------------------------------
// Power On
//--------------------------------
app.listen(PORT, () => console.log(`app is listening ${PORT}`));
