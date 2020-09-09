const { check, body, validationResult } = require('express-validator');

const loginValidation = () => {
	return [
		body('mobileNo')
			.notEmpty()
			.withMessage('Mobile Number is required')
			.isMobilePhone()
			.withMessage('Please enter valid mobile number')
			.trim(),
		body('password')
			.notEmpty()
			.withMessage('Password is required')
			// .matches(
			// 	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&_-])[A-Za-z\d@$.!%*#?&_-]{8,}$/
			// )
			// .withMessage(
			// 	'Password must be at least 5 characters, at least one letter, one number and one special character'
			// )
			.trim(),
	];
};

module.exports = {
	loginValidation,
};
