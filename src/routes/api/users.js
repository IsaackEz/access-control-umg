const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../../Models/User');
const cors = require('cors');

router.get('/', cors(), (req, res) => {
	User.find().then((user) => res.json(user));
});

router.get('/:userID', cors(), (req, res) => {
	const { userID } = req.params;
	User.find({ userID: userID }).then((user) => {
		if (user != '') {
			res.json([user[0].userID]);
		} else {
			res.json(user);
		}
	});
});

router.post('/', cors(), (req, res) => {
	const newUser = new User({
		userID: req.body.userID,
		userRol: req.body.userRol,
		name: req.body.name,
		lastname: req.body.lastname,
		career: req.body.career,
		semester: req.body.semester,
		email: req.body.email,
	});
	newUser.save().then((user) => res.json(user));
});

module.exports = router;
