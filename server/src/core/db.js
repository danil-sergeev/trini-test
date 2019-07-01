import mongoose from "mongoose";


const url = process.env.MONGO_URL;

const databaseOptions = {
    useNewUrlParser: true,
	autoIndex: false,
	reconnectTries: 100,
	reconnectInterval: 500,
	poolSize: 10,
	bufferMaxEntries: 0
};

export function initializeMongo () {
    mongoose.Promise = Promise;
    mongoose.connect(url, databaseOptions);
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error(error);
    });

    db.once('open', () => {
        console.log('MongoDB is up!');
    });
}