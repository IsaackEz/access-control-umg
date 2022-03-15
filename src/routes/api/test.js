const express = require('express');
const router = express.Router();
const Test = require('../../Models/Test');

router.get('/', (req, res) => {
	Test.find().then((test) => res.json(test));
});

router.post('/', (req, res) => {
	const newTest = new Test({
		userID: req.body.userID,
		time: req.body.time,
	});
	newTest.save().then((test) => res.json(test));
});

module.exports = router;
