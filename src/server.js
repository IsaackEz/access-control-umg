const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const records = require('./routes/api/records');
const users = require('./routes/api/users');
const test = require('./routes/api/test');
const cors = require('cors');

const app = express();
app.user(cors());
app.use(bodyParser.json());

app.use('/api/records', records);
app.use('/api/users', users);
app.use('/api/test', test);

// Assets for production

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('frontend/build'));
	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
	});
}

app.use(express.static(path.join(__dirname, 'public')));

//DB Config
const URI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

(async () => {
	try {
		const db = await mongoose.connect(URI);
		console.log('Db connected to', db.connection.name);
	} catch (error) {
		console.error(error);
	}
})();

app.listen(port, () => console.log(`Server started on port ${port}`));
