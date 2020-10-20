const express = require('express');
const Mongo = require('../utils/Mongo.js');
const driverDB = 'drivers'

const driverRouter = express.Router();
/**
 * Insert new user
 */
driverRouter.post('/', async (req, res) => {
        try {
                const db = await Mongo.connect();
                const { name }   = req.body;

                if (!name) {
                        return res.status(400).send({
                                message: 'Name field is required.'
                        });
                }
                db.collection(driverDB)
                  .updateOne({ name }, { $set: { name }}, { upsert: true })
                  .then( async (result) => {
                        res.send({ message: 'Driver successfully added.'});
                  });

        } catch (err) {
                console.log(err);
                res.status(500).send({
                        message: 'Internal Server Error: ' + JSON.stringify(err)
                });
        }
});

driverRouter.get('/', async (req, res) => {
        try {
                const db = await Mongo.connect();
                const collection = await db.collection(driverDB);
                const users = await collection.find().toArray();

                res.send(users);
        } catch (err) {
                console.log(err);
                res.status(500).send({
                        message: 'Internal Server Error: ' + JSON.stringify(err)
                });
        }
});

 /**
  * Delete user
  */
 driverRouter.get('/:name', async (req, res) => {
        try {
                const db = await Mongo.connect();
                const collection = await db.collection(driverDB);
                
                const { id } = req.params;

                const users = await collection.findOne().toArray();

                res.send(users);
        } catch (err) {
                console.log(err);
                res.status(500).send({
                        message: 'Internal Server Error: ' + JSON.stringify(err)
                });
        }
});

module.exports = driverRouter;