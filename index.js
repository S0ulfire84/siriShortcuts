const createEnturService = require('@entur/sdk').default
const TypeName = require('@entur/sdk').TypeName

var express = require('express');
var app = express();

const service = createEnturService({ clientName: 'alejandrosaksida-ruter-sirishortcuts' })

var pages = require("node-github-pages")(app, {
    static: "public", // Static directory path(css, js...)
    path: "docs" // Output path
  });
  pages.renderFiles([{
    "view": "index",
    "url": "",
    "options": { title: "Express" }
  },
  {
    "view": "second",
    "url": "/second",
    "options": { title: "second page" }
  }
  ]);



app.get('/', function (req, res) {
  //res.send('Hello World!');

  //Berg: NSR:StopPlace:6168 mot sentrum
  //Nationaltheatret: NSR:StopPlace:4067 mot east

  /*service.getTripPatterns({from: 
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
})*/

  /*service.getNearestPlaces({latitude: 59.951904, longitude: 10.7409389},
    {
        filterByPlaceTypes: [TypeName.STOP_PLACE],
        maximumDistance: 500,
    },
    ).then(result=>{
        console.log(result);
        res.send(result)
    })*/
  service.getDeparturesBetweenStopPlaces('NSR:StopPlace:6168', 'NSR:StopPlace:4067').then(result=>{
    

    const arrivalTimes = result.map(elem=>elem.expectedDepartureTime)

    var a = new Date(); // Current date now.
    var b = new Date(arrivalTimes[0]); // Start of 2010.

    var d = (b-a); // Difference in milliseconds.
    var seconds = parseInt((b-a)/1000);
    var minutes = parseInt(seconds / 60);

    //console.log(result);
    //res.send({time: arrivalTimes[0], current:a, b:b, d:minutes+" minutes from now"});
    res.send("Berg to center leaves in "+minutes+" minutes from now")
});

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});