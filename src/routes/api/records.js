const express = require('express');
const router = express.Router();
const cors = require('cors');
const geoJSON = require('../../public/UMG.json');

const Record = require('../../Models/Records');

router.get('/', cors(), (req, res) => {
	Record.find()
		.sort({ checkInTime: -1 })
		.then((users) => res.json(users));
});

router.get('/geojson', cors(), (req, res) => {
	res.json(geoJSON);
});

router.get('/filter', cors(), (req, res) => {
	Record.find({
		checkOutTime: '',
	})
		.sort({ checkInTime: -1 })
		.then((users) => res.json(users));
});

router.get('/arduino', cors(), (req, res) => {
	records = [];
	Record.find({
		checkOutTime: '',
	}).then((users) => {
		users.forEach((user, i) => {
			records[i] = user.userID;
		});
		res.json(records);
	});
});
router.get('/lastlocation', cors(), (req, res) => {
	records = [];
	Record.find({
		checkOutTime: '',
	}).then((users) => {
		users.forEach((user) => {
			records.push({
				userID: user.userID,
				records: user.records[user.records.length - 1],
			});
		});
		res.json(records);
	});
});

router.post('/', cors(), (req, res) => {
	console.log('works');
	const newUser = new Record({
		userID: req.body.userID,
		userRol: req.body.userRol,
		checkInPlace: req.body.checkInPlace,
		checkInTime: req.body.checkInTime,
		checkOutPlace: req.body.checkOutPlace,
		checkOutTime: req.body.checkOutTime,
		records: req.body.records,
	});
	newUser.save().then((users) => res.json(users));
	req.io.sockets.emit('newUser');
	console.log('works');
});

module.exports = router;
