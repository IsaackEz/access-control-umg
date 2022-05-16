const express = require('express');
const router = express.Router();
const cors = require('cors');

const Record = require('../../Models/Records');
const User = require('../../Models/User');

router.get('/', cors(), async (req, res) => {
	try {
		const records = await Record.find().sort({ checkInTime: 'desc' });
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

router.get('/lastseen', cors(), async (req, res) => {
	try {
		records = [];
		await Record.find().then((users) => {
			users.forEach((user) => {
				records.push({
					userID: user.userID,
					checkOutTime: user.checkOutTime,
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
		let recordFilter = JSON.parse(JSON.stringify(records));
		await User.find().then((users) => {
			users.forEach((user) => {
				recordFilter.forEach((record) => {
					if (user.userID == record.userID) {
						record['userRol'] = user.userRol;
					}
				});
			});
		});
		res.json(recordFilter);
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
		let userRole;
		await User.find().then((users) => {
			users.forEach((user) => {
				if (user.userID == userID) {
					userRole = user.userRol;
				}
			});
		});
		const filter = { userID: userID, checkOutPlace: '' };
		const recordFilter = await Record.find({
			userRol: userRole,
			checkOutTime: '',
		}).sort({ checkInTime: -1 });

		const usersAfter = recordFilter.length - 1;

		const update = {
			checkOutPlace: req.body.checkOutPlace,
			checkOutTime: req.body.checkOutTime,
			usersAfter: usersAfter,
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
		let count = 0;
		const { userID } = req.params;
		let userRole;
		await User.find().then((users) => {
			users.forEach((user) => {
				if (user.userID == userID) {
					userRole = user.userRol;
				}
			});
		});
		const recordFilter = await Record.find({
			userRol: userRole,
			checkOutTime: '',
		}).sort({ checkInTime: -1 });
		recordFilter.forEach((record) => {
			record.records.forEach((recordIn) => {
				if (recordIn.recordInPlace == req.body.records[0].recordInPlace) {
					count++;
				}
			});
		});
		const usersBefore = count + 1;

		const usersAfter = count - 1;
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
					usersBefore: usersBefore,
				},
			},
		};

		const firstOut = {
			$set: {
				'records.$.recordOutTime': req.body.records[0].recordOutTime,
				'records.$.usersAfter': usersAfter,
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
		let userRole;
		await User.find().then((users) => {
			users.forEach((user) => {
				if (user.userID == req.body.userID) {
					userRole = user.userRol;
				}
			});
		});

		const records = await Record.find({
			userRol: userRole,
			checkOutTime: '',
		});
		const usrBefore = records.length + 1;

		const newUser = new Record({
			userID: req.body.userID,
			userRol: userRole,
			checkInPlace: req.body.checkInPlace,
			checkInTime: req.body.checkInTime,
			checkOutPlace: req.body.checkOutPlace,
			checkOutTime: req.body.checkOutTime,
			usersBefore: usrBefore,
			records: req.body.records,
		});

		const recordsT = await newUser.save();
		res.json(recordsT);
		req.io.sockets.emit('newUser');
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
