const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
	question: {
		type: String,
	},
	option: [],
	correctAnswer: {
		type: String,
	},
	status: {
		type: Number,
		length: 1,
		default: '1',
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
	},
});
module.exports = mongoose.model('Quiz', QuizSchema);
