var express = require('express');
var app = express();

var request = require('request');

var address = 'http://192.168.0.50:3001';

var temperature = require('./temperature.local.js');

var HAL = 'http://192.168.0.50';
request.post({
    url:HAL+'/api/v1/Nodes',
    body:{
        name: 'HAL',
        address: address
    },
    json: true
}, function (error, response, body) {
    console.log(error,body);
});

var sendNotification = function (body) {
    request.post({
        url:HAL+'/api/v1/Notifications',
        body:body,
        json: true
    }, function (error, response, body) {
        console.log(error,body);
    });
};

var lastNotifiedTemperature = -1000;
var lastNotifiedHumidity = -1000;
var sendNotifications = function (temp,h) {
    sendNotification({
        title: 'Temperature is ' + temp + '°F'
    });
    sendNotification({
        title: 'Humidity is ' + h + '%'
    });
    lastNotifiedTemperature = temp;
};
var sendTemperatureUpdates = function () {
    var temp = temperature.getTemperatureFahrenheit();
    var h = temperature.getHumidity();
    if (Math.abs(lastNotifiedTemperature-temp)>1||Math.abs(lastNotifiedHumidity-h)>1) {
        sendNotifications(temp,h);
    }
    setTimeout(sendTemperatureUpdates,500);
};
sendTemperatureUpdates();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function (req, res) {
    res.send({
        display_name: 'HAL',
        id: 2,
        inputs: true
    });
});

app.get('/inputs', function(req,res) {


    res.send([
        {
            value: temperature.getTemperatureFahrenheit(),
            display_name: 'Temperature (°F)',
            unit: 'Degrees Fahrenheit',
            unit_abbreviation: '°F',
            min: -20,
            max: 120
        },
        {
            value: temperature.getTemperatureCelsius(),
            display_name: 'Temperature (°C)',
            unit: 'Degrees Celsius',
            unit_abbreviation: '°C',
            min: -29,
            max: 49
        },
        {
            value: temperature.getHumidity(),
            display_name: 'Humidity (%)',
            unit: 'Percentage',
            unit_abbreviation: '%',
            min: 0,
            max: 100
        }
    ]);
});

var server = app.listen(3001, function () {
    console.log('Automation Node at ' + address);
});