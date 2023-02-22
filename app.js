require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
// Import the sessions packages
const apiRoutes = require('./routes/api-routes')
const htmlRoutes = require('./routes/html-routes')
const app = express()

const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db')

const sessionStore = new MySQLStore({}, db);
app.use(session({
	key: 'session_cookie',
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	proxy: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24
	}
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Add code to use sessions with a MySQL Store

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use('/', htmlRoutes)
app.use('/api', apiRoutes)

module.exports = app
