const CONFIG = require('config');

const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

class CoreMongo {
        // initialize 
        constructor() {
                this.database = null;
        }

        // close connection
        close () {
                this.database.close();
        }

        // generate new mongo object id format
        ObjectId() {
                return ObjectId;
        }

        // get collection from table name
        async getCollection (tableName) {
                const db =  await this.database;
                return db.collection(tableName);
        }

        // find single record from table name
        async findOne (tableName, query, options) {
                const table = await this.getCollection(tableName);
                return table.findOne(query, options);
        }

        // find record(s) from the table name
        async find (tableName, query, options) {
                const table = await this.getCollection(tableName);
                return table.find(query, options);
        }


        // connect to the mmongodb
        async connect () {
                try {
                        const client = await MongoClient.connect(
                                // `mongodb+srv://${ database_user }: ${ database_password }@cluster0.fxels.mongodb.net/${ database_name }?retryWrites=true&w=majority`,
                                CONFIG.DB_HOST,
                                { useUnifiedTopology: true },
                                { useNewUrlParser: true }                            
                        )
                        this.database = client.db(CONFIG.DB_NAME);
                        return this.database;
                } catch (e) {
                        console.log(e);
                        return null;
                }
        }

}


module.exports = new CoreMongo();