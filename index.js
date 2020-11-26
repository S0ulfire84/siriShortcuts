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

    service.getTripPatterns({from: 
        {
            coordinates: {
                latitude:59.951888,longitude:10.744455
            }
        },
        to: {
            coordinates:{latitude: 59.9143454, longitude: 10.7284128}
        },
        modes: ['foot', 'metro']
    })
    .then(result=>{
        console.log(result);
        res.send(result)
    })

});

app.get('/metro-nearest-places', function (req, res) {
    //Berg: NSR:StopPlace:6168 mot sentrum
    //Nationaltheatret: NSR:StopPlace:4067 mot east

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

app.get('/berg', function (req, res) {
  
  service.getDeparturesBetweenStopPlaces('NSR:StopPlace:6168', 'NSR:StopPlace:4067').then(result=>{
    
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