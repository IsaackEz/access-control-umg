const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

const connectDB = (async () => {
	try {
		const db = await mongoose.connect(URI);
		console.log('Db connected to', db.connection.name);
	} catch (error) {
		console.error(error);
	}
})();

module.exports = connectDB;
