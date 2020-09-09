const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const QuizResultSchema = new Schema({
	quiz: [
		{
			question: {
				type: String,
			},
			userAnswer: {
				type: String,
			},
			correctAnswer: {
				type: String,
			},
			marks: {
				type: Number,
			},
		},
	],
	userID: {
		type: mongoose.Schema.Types.ObjectId,
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
module.exports = mongoose.model('quizResult', QuizResultSchema);
