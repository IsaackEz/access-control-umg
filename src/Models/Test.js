const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema(
	{
		userID: { type: String, trim: true },
		time: { type: String, trim: true },
	},
	{ timestamps: true }
);

module.exports = Test = mongoose.model('test', TestSchema);
