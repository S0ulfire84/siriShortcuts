const PORT = process.env.PORT || 5000

const createEnturService = require('@entur/sdk').default
const TypeName = require('@entur/sdk').TypeName


var express = require('express')
var app = express()

const service = createEnturService({ clientName: 'alejandrosaksida-ruter-sirishortcuts' })

app.get('/', function (req, res) {
    res.send('Welcome to the Siri shortcuts app!');
});

app.get('/metro-with-coords-from-to', function (req, res) {
  //Berg: NSR:StopPlace:6168 mot sentrum
  //Nationaltheatret: NSR:StopPlace:4067 mot east
    const bergCoordinates = {lat: 59.951888, lon: 10.744455}
    const nationaltheatretCoordinates = {lat: 59.9143454, lon: 10.7284128}

    const fromCoordinates = nationaltheatretCoordinates;
    const toCoordinates = bergCoordinates;

    service.getTripPatterns({from: 
        {
            coordinates: {
                latitude:fromCoordinates.lat,longitude:fromCoordinates.lon
            }
        },
        to: {
            coordinates:{latitude: toCoordinates.lat, longitude: toCoordinates.lon}
        },
        modes: ['foot', 'metro']
    })
    .then(result=>{
        console.log(result);
        res.send(result)
    })

});

app.get('/metro-nearest-places', function (req, res) {
    //Berg: NSR:StopPlace:6168
    //Nationaltheatret: NSR:StopPlace:4067

    service.getNearestPlaces({latitude: 59.951904, longitude: 10.7409389},
        {
            filterByPlaceTypes: [TypeName.STOP_PLACE],
            maximumDistance: 500,
        },
    ).then(result=>{
        console.log(result);
        res.send(result)
    })
});

app.get('/nationaltheatret', function (req, res) {

    const stopPlaceIdBerg = 'NSR:StopPlace:6168';
    const stopPlaceIdNationaltheatret = 'NSR:StopPlace:4067';
  
    service.getDeparturesBetweenStopPlaces(stopPlaceIdBerg, stopPlaceIdNationaltheatret).then(result=>{
        
        const arrivalTimes = result.map(elem=>elem.expectedDepartureTime)

        const a = new Date(); // Current date now.
        const b = new Date(arrivalTimes[0]); // The first coming metro

        const d = (b-a); // Difference in milliseconds.
        const seconds = parseInt((b-a)/1000);
        const minutes = parseInt(seconds / 60);

        const secondsOfMinutes = seconds - minutes * 60;

        let response = "Sognsvann metro leaves in "+minutes+" minutes and "+ secondsOfMinutes + " seconds from now.";
        res.send(response);
    });

});

app.get('/berg', function (req, res) {

    const stopPlaceIdBerg = 'NSR:StopPlace:6168';
    const stopPlaceIdNationaltheatret = 'NSR:StopPlace:4067';
  
    service.getDeparturesBetweenStopPlaces(stopPlaceIdBerg, stopPlaceIdNationaltheatret).then(result=>{
        
        const arrivalTimes = result.map(elem=>elem.expectedDepartureTime)

        const a = new Date(); // Current date now.
        const b = new Date(arrivalTimes[0]); // The first coming metro

        const d = (b-a); // Difference in milliseconds.
        const seconds = parseInt((b-a)/1000);
        const minutes = parseInt(seconds / 60);

        const secondsOfMinutes = seconds - minutes * 60;

        let response = "Berg to center leaves in "+minutes+" minutes and "+ secondsOfMinutes + " seconds from now.";
        if (seconds < 70) response += " You'll have to dash to reach it."
        else if (seconds < 60 * 4) response += " Run Forest, Run!"
        else if (seconds < 60 * 6) response += " Leave now and power-walk."
        else if (seconds < 60 * 8) response += " You'll catch walking it if you leave now."
        else response += (" You can still wait " + (minutes - 6) +" minutes, but don't fall asleep.")
        res.send(response);
    });

});

app.listen(PORT, function () {
  console.log('Siri shortcuts app listening on port '+PORT+'!');
});