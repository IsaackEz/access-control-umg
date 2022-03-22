const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const records = require('./routes/api/records');
const users = require('./routes/api/users');
const test = require('./routes/api/test');
const cors = require('cors');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const port = process.env.PORT || 5000;
const { connectDB } = require('./db');
const app = express();

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

app.use(cors());
app.use(bodyParser.json());

connectDB;

Sentry.init({
	dsn: 'https://917d7cf64cf24141a50ffba877d48ee3@o1169807.ingest.sentry.io/6263209',
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
	],
	tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

io.on('connection', function (socket) {
	console.log('Connected to socket.io');
});

app.use(function (req, res, next) {
	req.io = io;
	next();
});

app.use('/api/records', records);
app.use('/api/users', users);
app.use('/api/test', test);

app.use(Sentry.Handlers.errorHandler());

// Assets for production

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('frontend/build'));
	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
	});
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.send('Welcome to Access Control UMG');
});

server.listen(port, () => {
	console.log(`Server is in port ${port}`);
});

module.exports = app;
