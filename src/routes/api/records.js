const express = require('express');
const router = express.Router();
const cors = require('cors');

const Record = require('../../Models/Records');

router.get('/', cors(), async (req, res) => {
	try {
		const records = await Record.find().sort({ checkInTime: -1 });
		res.json(records);
	} catch (error) {
		console.log({ error });
	}
});

router.get('/lastlocation', cors(), async (req, res) => {
	try {
		records = [];
		await Record.find({
			checkOutTime: '',
		}).then((users) => {
			users.forEach((user) => {
				records.push({
					userID: user.userID,
					records: user.records[user.records.length - 1],
				});
			});
		});
		res.json(records);
	} catch (error) {
		console.log({ error });
	}
});

router.get('/filter', cors(), async (req, res) => {
	try {
		const records = await Record.find({
			checkOutTime: '',
		}).sort({ checkInTime: -1 });
		res.json(records);
	} catch (error) {
		console.log(error);
	}
});

router.get('/:userID', cors(), async (req, res) => {
	try {
		const { userID } = req.params;
		await Record.find({
			userID: userID,
			checkOutTime: '',
		}).then((user) => {
			if (user != '') {
				res.json(
					user[0].userID +
						'/' +
						user[0].records[user[0].records.length - 1].recordInPlace
				);
			} else {
				res.json(user);
			}
		});
	} catch (error) {
		console.log(error);
	}
});

router.post('/:userID', cors(), async (req, res) => {
	try {
		const { userID } = req.params;
		const filter = { userID: userID, checkOutPlace: '' };
		const update = {
			checkOutPlace: req.body.checkOutPlace,
			checkOutTime: req.body.checkOutTime,
		};
		const records = await Record.findOneAndUpdate(filter, update);
		res.json(records);
		req.io.sockets.emit('newUser');
	} catch (error) {
		console.log(error);
	}
});

router.post('/update/:userID', cors(), async (req, res) => {
	try {
		const { userID } = req.params;
		const filter = { userID: userID, checkOutPlace: '' };
		const filterOut = {
			userID: userID,
			'records.recordOutTime': '',
		};
		const firstEntry = {
			$set: {
				records: {
					recordInPlace: req.body.records[0].recordInPlace,
					recordInTime: req.body.records[0].recordInTime,
					recordOutTime: null,
				},
			},
		};

		const firstOut = {
			$set: {
				'records.$.recordOutTime': req.body.records[0].recordOutTime,
			},
		};

		const newRecord = {
			$push: {
				records: {
					recordInPlace: req.body.records[0].recordInPlace,
					recordInTime: req.body.records[0].recordInTime,
					recordOutTime: null,
				},
			},
		};

		records = [];
		await Record.find({
			userID: userID,
			checkOutTime: '',
		}).then((users) => {
			users.forEach((user) => {
				records.push({
					userID: user.userID,
					records: user.records[user.records.length - 1],
				});
			});
		});

		if (records[0].records.recordInPlace == '') {
			const records = await Record.findOneAndUpdate(filter, firstEntry);
			res.json(records);
		} else if (
			records[0].records.recordInPlace != '' &&
			records[0].records.recordOutTime == null
		) {
			const records = await Record.findOneAndUpdate(filterOut, firstOut);
			res.json(records);
		} else if (
			records[0].records.recordInPlace != '' &&
			records[0].records.recordOutTime != null
		) {
			const records = await Record.findOneAndUpdate(filter, newRecord);
			res.json(records);
		} else {
			console.log('Couldnt update');
		}
		req.io.sockets.emit('newUser');
	} catch (error) {
		console.log(error);
	}
});

router.post('/', cors(), async (req, res) => {
	try {
		const newUser = new Record(req.body);
		const records = await newUser.save();
		res.json(records);
		req.io.sockets.emit('newUser');
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
