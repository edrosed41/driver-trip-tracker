# Driver Trip Tracker

## Description
Track Driver Trips by uploading a txt file and then the application process the uploaded file and displays the result.
You can test the application in https://driver-trip-tracker.herokuapp.com. 

Sample text file document format: 
- \<Command\> \<Driver name\> \<Trip start time\> \<Trip end time\> \<Distance travelled\><br/>
- Command value can be Driver or Trip. Please se sample below.
  
```
Driver Dan
Trip Dan 07:15 08:45 17.3
Trip Dan Christian 07:15 08:45 17.3
sdfdsfd afdsfs fsdfd 
Tr1p Dan sdfds
Trip Lauren 12:01 14:31 142.09
```
Or you can use <b><i>import_file.txt</i></b> that comes with the project.

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

### Run Tes
```
npm run test
```
Note: Make sure to install mongodb v4+.  <br />



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
