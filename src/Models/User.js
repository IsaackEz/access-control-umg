const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userID: { type: String, required: true, unique: true, trim: true },
	userRol: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	lastname: { type: String, required: true, trim: true },
	career: { type: String, trim: true },
	semester: { type: Number, trim: true },
	email: { type: String, required: true, trim: true },
});

module.exports = User = mongoose.model('users', UserSchema);
