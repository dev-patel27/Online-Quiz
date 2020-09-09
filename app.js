const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const store = new MongoDbStore({
	uri: process.env.MONGO_URL,
	collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			new Date().getTime() + '-' + file.originalname.split(' ').join('')
		);
	},
});

app.use(multer({ storage: fileStorage }).single('image'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(routes);

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		app.listen(5000);
		console.log('Database connected successfully...');
	})
	.catch((err) => {
		console.log(err);
	});
