const express = require('express');
const router = express.Router();
const Test = require('../../Models/Test');
const cors = require('cors');
router.get('/', cors(), (req, res) => {
	Test.find().then((test) => res.json(test));
});

router.post('/', cors(), (req, res) => {
	const newTest = new Test({
		userID: req.body.userID,
		time: req.body.time,
	});
	newTest.save().then((test) => res.json(test));
});

module.exports = router;
