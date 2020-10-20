# driver-trip-tracker

## Description
```
Track Driver Trips by uploading a txt file and then the application process the uploaded file and displays the result.
You can test the application in https://driver-trip-tracker.herokuapp.com. 
```

## Project setup
```
npm install
```

### Run In Local
```
npm run startbackend
```
You can then visit http://localhost:5000<br />
For the api: <br />
Upload trips: POST http://localhost:5000/api/trips/upload <br />
Get all trips: GET http://localhost:5000/api/trips <br />
Clear all trips: DELETE http://localhost:5000/api/trips<br />
<br /><br />
Note: Make sure to install mongodb v4+.  <br />

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
