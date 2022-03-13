const express = require('express');
const router = express.Router();

const Record = require('../../Models/Records');

router.get('/', (req, res) => {
	Record.find()
		.sort({ checkInTime: -1 })
		.then((users) => res.json(users));
});

router.get('/filter', (req, res) => {
	Record.find({
		checkOutTime: '',
	})
		.sort({ checkInTime: -1 })
		.then((users) => res.json(users));
});

router.get('/lastlocation', (req, res) => {
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

router.post('/', (req, res) => {
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
});

module.exports = router;
