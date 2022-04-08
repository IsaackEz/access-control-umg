const express = require('express');
const router = express.Router();
const Admin = require('../../Models/Admin');
const cors = require('cors');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

router.get('/:adminID', cors(), (req, res) => {
	const { adminID } = req.params;
	Admin.find({ username: adminID }).then((admin) => res.json(admin[0]));
});

router.post('/signup', cors(), async (req, res) => {
	try {
		const admin = await Admin.findOne({
			$or: [{ username: req.body.username }, { email: req.body.email }],
		});
		if (admin)
			return res.status(409).send({ message: 'El administrador ya existe' });

		const salt = await bcrypt.genSalt(Number(10));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		const secret = speakeasy.generateSecret();
		await new Admin({
			...req.body,
			password: hashPassword,
			secret: secret.base32,
		}).save();
		res.status(201).send({ message: 'Administrador creado!' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Error generado llave' });
	}
});

router.post('/verify', cors(), async (req, res) => {
	const { token, adminID } = req.body;

	try {
		const admin = await Admin.findOne({ username: adminID });

		const verified = speakeasy.totp.verify({
			secret: admin.secret,
			encoding: 'base32',
			token: token,
		});

		if (verified) {
			res.json({ verified: true });
		} else {
			res.status(401).send({ message: 'Codigo invalido' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'No se encontro el usuario.' });
	}
});
router.post('/:adminID', cors(), async (req, res) => {
	try {
		const { tfa } = req.body;
		const { adminID } = req.params;
		const filter = { username: adminID };

		const update = {
			tfa: tfa,
		};
		const admins = await Admin.findOneAndUpdate(filter, update);
		res.json(admins);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Error al activar 2FA' });
	}
});

router.post('/login', cors(), async (req, res) => {
	try {
		const admin = await Admin.findOne({ username: req.body.username });
		if (!admin)
			return res
				.status(401)
				.send({ message: 'Usuario o contraseña incorrectas' });

		const validPassword = await bcrypt.compare(
			req.body.password,
			admin.password
		);
		if (!validPassword)
			return res
				.status(401)
				.send({ message: 'Usuario o contraseña incorrectas' });
		res.status(200).send({
			message: 'Credenciales correctas.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Error del servidor' });
	}
});

module.exports = router;
