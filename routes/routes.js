const express = require('express');
const frontController = require('../controllers/front');
const { loginValidation } = require('../middleware/validate');
const router = express.Router();

router.get('/', frontController.getLogin);

router.get('/register', frontController.getRegister);

router.post('/post/login', loginValidation(), frontController.postLogin);
router.get('/dashboard', frontController.getDashboard);
router.post('/post/register', frontController.postRegister);
router.post('/post/startQuiz', frontController.postStartQuiz);
router.post('/post/answer', frontController.postQuizAnswer);
router.get('/logout', frontController.getLogout);
router.get('/thankyou/:quizID', frontController.getThankyou);
router.get('/quizHistory/:userID', frontController.getQuizHistory);
router.get('/quizDetails/:quizID', frontController.getQuizDetails);

module.exports = router;
