const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../../Models/User');
const cors = require('cors');
router.get('/', cors(), (req, res) => {
	User.find().then((user) => res.json(user));
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

router.get('/geojson', cors(), (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/UMG.json'));
});

module.exports = router;
