const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cors = require('cors');

const driverRouter = require('./backend/routes/driver.js');
const tripRouter = require('./backend/routes/trip.js');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/dist')));

// app.get('/', (req, res) => res.send('Let\'s get it on!!'));
app.use('/api/drivers', driverRouter);
app.use('/api/trips', tripRouter);

app.listen(process.env.PORT || 5000, () => console.log('driver tracker app is running @ port:5000'));

module.exports = app;