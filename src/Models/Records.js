const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
	userID: { type: String, required: true, trim: true },
	userRol: { type: String, trim: true },
	checkInPlace: { type: String, required: true, trim: true },
	checkInTime: { type: Date, required: true, trim: true },
	checkOutPlace: { type: String, trim: true },
	checkOutTime: { type: Date, trim: true },
	usersAfter: { type: Number, trim: true },
	usersBefore: { type: Number, trim: true },
	records: [
		{
			recordInPlace: { type: String, trim: true },
			recordInTime: { type: Date, trim: true },
			recordOutTime: { type: Date, trim: true },
			usersAfter: { type: Number, trim: true },
			usersBefore: { type: Number, trim: true },
		},
	],
});

module.exports = Record = mongoose.model('records', RecordSchema);
