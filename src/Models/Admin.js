const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
	username: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true },
	fullName: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, trim: true },
});

module.exports = Admin = mongoose.model('admins', AdminSchema);
