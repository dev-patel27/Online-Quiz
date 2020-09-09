const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	email: {
		type: String,
	},
	mobileNo: {
		type: String,
	},
	password: {
		type: String,
	},
	gender: {
		type: String,
	},
	country: {
		type: String,
	},
	state: {
		type: String,
	},
	city: {
		type: String,
	},
	dob: {
		type: Date,
	},
	hobbies: [],
	image: {
		type: String,
	},
	quizzs : [ 
		{
			quiz: [
				{
					quizID :  {
						type : String,
					},
					correctAnswer : {
						type: String,
					},
					marks: {
						type: Number,
					}
				},
			],
		}	
	],
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
module.exports = mongoose.model('User', UserSchema);
