const express = require('express');
const router = express.Router();
const Admin = require('../../Models/Admin');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

		await new Admin({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: 'Administrador creado!' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Error generado llave' });
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
			message: 'Inicio de sesion exitoso.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Error del servidor' });
	}
});

module.exports = router;
