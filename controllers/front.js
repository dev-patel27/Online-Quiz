const mongoose = require('mongoose');
const City = require('../models/city');
const Country = require('../models/country');
const State = require('../models/state');
const User = require('../models/user');
const Quiz = require('../models/quiz');
const QuizResult = require('../models/quizResult');
const bcrypt = require('bcryptjs');
const { check, validationResult, body } = require('express-validator');
const session = require('express-session');

module.exports.getLogin = async (req, res, next) => {
	if (req.session.isAuth === true) {
		res.redirect('/dashboard');
	} else {
		res.render('login');
	}
};

module.exports.postLogin = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({
				status: '422',
				error: errors.array({ onlyFirstError: true }),
			});
		}
		const mobileNo = req.body.mobileNo;
		const password = req.body.password;
		const isMobileExits = await User.findOne({
			mobileNo: mobileNo,
			status: '1',
		});
		if (isMobileExits) {
			const isPasswordMatch = await bcrypt.compare(
				password,
				isMobileExits.password
			);
			if (isPasswordMatch) {
				req.session.isAuth = true;
				req.session.data = isMobileExits;
				res.json({
					status: '200',
					data: 'login successful...',
				});
			} else {
				res.json({
					status: '422',
					error: 'Incorrect password',
				});
			}
		} else {
			res.json({
				status: '422',
				error: 'User does/nt exist. Please register first...',
			});
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.postRegister = async (req, res, next) => {
	try {
		const firstName = req.body.firstName;
		const lastName = req.body.lastName;
		const email = req.body.email;
		const mobileNo = req.body.mobileNo;
		const password = req.body.password;
		const confirmPassword = req.body.confirmPassword;
		const gender = req.body.gender;
		const country = req.body.country;
		const state = req.body.state;
		const city = req.body.city;
		const dob = req.body.dob;
		const hobbies = req.body.hobbies;
		const image = req.file;
		const isMobileExist = await User.find({ mobileNo: mobileNo });

		if (isMobileExist.length > 0) {
			return res.json({
				status: '422',
				error: 'Mobile number is already exist. Try another one!!!',
			});
		}
		const hashPassword = await bcrypt.hash(password, 12);
		const user = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			mobileNo: mobileNo,
			password: hashPassword,
			gender: gender,
			country: country,
			state: state,
			city: city,
			dob: dob,
			hobbies: hobbies,
			image: image.filename,
		});
		const result = await user.save();
		console.log(result);
		if (result) {
			res.json({
				status: '200',
				data: 'Registration successful...',
			});
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.getLogout = async (req, res, next) => {
	req.session.destroy();
	res.redirect('/');
};

module.exports.postStartQuiz = async (req, res, next) => {
	try {
		if (req.session.isAuth === true) {
			let page = 1;
			const quiz = await Quiz.find().limit(1);
			const submitAns = new QuizResult({
				userID: req.session.data._id,
			});
			const result = await submitAns.save();
			if (result) {
				res.json({
					status: '200',
					pageNo: page,
					data: quiz,
					id: result._id,
				});
			} else {
				res.json({
					status: '400',
					data: 'Something went wrong!!!',
				});
			}
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.postQuizAnswer = async (req, res, next) => {
	try {
		if (req.session.isAuth === true) {
			let perPage = 1;
			let page = req.body.page;
			let activeFlag = req.body.activeFlag;
			let marks = req.body.marks;
			let finalMarks = 10 - marks;
			const id = req.body.id;
			const question = req.body.question;
			const correctAnswer = req.body.correctAnswer;
			const userAnswer =
				req.body.userAnswer !== undefined ? req.body.userAnswer : '';
			if (activeFlag == 0) {
				const submitAns = new QuizResult({
					quiz: [
						{
							question: question,
							userAnswer: userAnswer,
							correctAnswer: correctAnswer,
							marks: marks,
						},
					],
				});
				const result = await submitAns.save();
				if (result) {
					const quiz = await Quiz.find()
						.limit(perPage)
						.skip(perPage * page);
					if (quiz) {
						res.json({
							status: '200',
							pageNo: ++page,
							data: quiz,
							id: result._id,
						});
					} else {
						res.json({
							status: '400',
							data: 'Something went wrong!!!',
						});
					}
				}
			} else {
				const submitAns = await QuizResult.findOneAndUpdate(
					{ _id: id },
					{
						$push: {
							quiz: {
								question: question,
								userAnswer: userAnswer,
								correctAnswer: correctAnswer,
								marks: marks,
							},
						},
					}
				);
				if (submitAns) {
					const quiz = await Quiz.find()
						.limit(perPage)
						.skip(perPage * page);
					if (quiz) {
						res.json({
							status: '200',
							pageNo: ++page,
							data: quiz,
							quizID: submitAns._id,
						});
					} else {
						res.json({
							status: '400',
							data: 'Something went wrong!!!',
						});
					}
				}
			}
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.getDashboard = async (req, res, next) => {
	try {
		if (req.session.isAuth === true) {
			res.render('dashboard', {
				data: req.session.data,
			});
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.getThankyou = async (req, res, next) => {
	try {
		if (req.session.isAuth === true) {
			let score = 0;
			const submittedQuiz = await QuizResult.findById({
				_id: req.params.quizID,
			});
			submittedQuiz.quiz.forEach((quizzes) => {
				if (
					quizzes.userAnswer.toString() == quizzes.correctAnswer.toString()
				) {
					score += parseInt(quizzes.marks);
				}
			});
			if (submittedQuiz) {
				res.render('thankyou', {
					quizId: submittedQuiz._id,
					quizScore: score,
					userID: submittedQuiz.userID,
				});
			}
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.getQuizHistory = async (req, res, next) => {
	try {
		if (req.session.isAuth === true) {
			const quizHistory = await QuizResult.find({
				userID: req.params.userID,
			});
			const userDetails = await User.find({
				_id: req.params.userID,
			});
			if (quizHistory) {
				res.render('quizHistory', {
					quizHistory: quizHistory,
					userData: userDetails,
				});
			}
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.getQuizDetails = async (req, res, next) => {
	try {
		if (req.session.isAuth === true) {
			const quizDetails = await QuizResult.findById({
				_id: req.params.quizID,
			});

			if (quizDetails) {
				res.render('quizDetails', {
					quizDetails: quizDetails,
				});
			}
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.getRegister = async (req, res, next) => {
	try {
		if (req.session.isAuth !== true) {
			const country = await Country.find();
			const state = await State.find();
			const city = await City.find();
			res.render('registration', {
				country: country,
				state: state,
				city: city,
			});
		} else {
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};
