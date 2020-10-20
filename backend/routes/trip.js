const express = require('express');
const Mongo = require('../utils/Mongo.js');
const multer = require('multer');
const enums = require('../Enums');

const isValidCommand = require('../utils/Utils').isValidCommand;
const getCommandFromText = require('../utils/Utils').getCommandFromText;
const getDriversNameFromText = require('../utils/Utils').getDriversNameFromText;
const processTrip = require('../utils/Utils').processTrip;

const tripDB = 'trips';
const driverDB = 'drivers';
const upload = multer({ dest: 'uploads/', storage: multer.memoryStorage() });
const tripRouter = express.Router();

/**
 * Name: <api_url>/trips/upload
 * Description: Accepts form-data and process text per line depending on the command
 * Type: POST
 * Params: file
 */
tripRouter.post('/upload', upload.single('file') ,async (req, res) => { 
        try {
                const db = await Mongo.connect();
                // Split input by next line
                const inputs = req.file.buffer.toString().split(/(?:\r|\n|\r\n)/g);
                // Validate if inputs length is equal to zero then return error.
                // Else continue to process inputs
                if (inputs.length === 0 || inputs[0] === '') {
                        return res.status(500).send({
                                message: 'Empty text file.'
                        });
                }

                // Iterate inputs
                for (const line of inputs) {
                        // Get command first.
                        // We could split line of text using line.split(/\s+/) however, split might be complex to handle if there are anomalies in between the line of text.
                        if (!line) {
                                continue;
                        }
                        const command = getCommandFromText(line);
                        // const action = [];
                        
                        // Check if command is not valid. Then continue and process next item.
                        if (!isValidCommand(command)) {
                                continue;
                        }

                        // Get the driver's name
                        const driver = { name: getDriversNameFromText(line) };
                        switch (command.toLowerCase()) {
                                case enums.IMPORT_COMMANDS.DRIVER:
                                        // Insert or Update driver
                                        await db.collection(driverDB)
                                                .updateOne( driver, 
                                                            { $set: driver }, 
                                                            { upsert: true });
                                        break;
                                case enums.IMPORT_COMMANDS.TRIP:
                                        // Process trip
                                        const trip = processTrip(line);
                                        // Get driver if already exist in drivers record else insert
                                        if (trip.speed > 5 && trip.speed < 100) {
                                                const tripDriver = await db.collection(driverDB)
                                                                 .findOneAndUpdate( { 'name': driver.name }, 
                                                                                    { $set: driver },
                                                                                    { projection: { _id: 1 }, upsert: true });
                                                // Insert trip to trips record
                                                if (!tripDriver.value) {
                                                        tripDriver.value = {};
                                                        tripDriver.value._id = tripDriver.lastErrorObject.upserted;
                                                }
                                                await db.collection(tripDB).insertOne({ driverId: tripDriver.value._id, ...trip });
                                        }
                                        break;
                                default:
                                        break;
                        }
                }

                res.send({ message: 'Successfully uploaded and processed the file.'});
        } catch (err) {
                console.log(err);
                res.status(500).send({
                        message: 'Internal Server Error: ' + JSON.stringify(err)
                });
        }
});

/**
 * Name: <api_url>/trips/
 * Description: Get all trips
 * Type: GET
 * Params: file
 */
tripRouter.get('/', async (req, res) => { 
        try {
                const db = await Mongo.connect();
                const allTrips =  await db.collection(driverDB).aggregate([
                                        {
                                                $lookup: {
                                                        from: tripDB,
                                                        localField: '_id',
                                                        foreignField: 'driverId',
                                                        as: 'trips'
                                                }
                                        },
                                        {
                                                $set: {
                                                        totalDistance: { $round: [{$sum: '$trips.distance' }, 0]},
                                                        totalTripTime: {  $sum: '$trips.time' },
                                                        totalSpeed: { 
                                                                $cond: [ { $gt : [{ $sum: '$trips.distance' }, 0 ]},
                                                                         { $round: [{$divide: [{ $sum: '$trips.distance' }, {  $sum: '$trips.time' }] }, 0]},
                                                                         0
                                                                        ]}
                                                }
                                        }
                                        ]).toArray();
                res.send(allTrips);
        } catch (err) {
                console.log(err);
                res.status(500).send({
                        message: 'Internal Server Error: ' + JSON.stringify(err)
                });
        }
});

/**
 * Name: <api_url>/trips/
 * Description: Accepts form-data and process text per line depending on the command
 * Type: DELETE
 * Params: 
 */

 tripRouter.delete('/', async (req, res) => { 
        try {
                const db = await Mongo.connect();
                await db.collection(tripDB).deleteMany({}).then((tripDeleteRsult) => {
                        // res.send({message: 'Successfully deleted all trips.'});
                });

                await db.collection(driverDB).deleteMany({}).then((driverDeleteRsult) => {
                        res.send({message: 'Successfully deleted all trips.'});
                });
        } catch (err) {
                console.log(err);
                res.status(500).send({
                        message: 'Internal Server Error: ' + JSON.stringify(err)
                });
        }
})

module.exports = tripRouter;