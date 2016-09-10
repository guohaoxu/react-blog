var express = require('express'),

  path = require('path'),
  util = require('util'),

  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  flash = require('connect-flash'),

  methodOverride = require('method-override'),
  compression = require('compression'),

  favicon = require('serve-favicon'),
  settings = require('./server/settings'),
  routes = require('./server/routes'),

  logger = require('morgan'),
  errorHandler = require('errorhandler'),

  mongoose = require('mongoose'),
  dbURL = process.env.dbURL || settings.dbURL,

  MongoStore = require('connect-mongo')(session),
  sessionStore = new MongoStore({
    url: dbURL
  }),

  passport = require('passport'),
  setPassport = require('./server/setPassport')

  app = express()

mongoose.Promise = global.Promise
mongoose.connect(dbURL)
  .then(() => console.log('mongoose connection successful'))
  .catch((error) => console.error('error', error))

app.set('trust proxy', true)
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(methodOverride())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  secret: settings.cookieSecret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  },
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}))
app.use(compression())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
setPassport()

if (app.get('env') === 'development') {
  app.use(logger('dev'))
  app.use(errorHandler())
}

var index = '', staticDir = ''
if (app.get('env') === 'development') {
  index = './public/index.html'
  staticDir = 'public'
} else {
  index = './build/index.html'
  staticDir = 'build'
}

app.use(favicon(path.join(__dirname, staticDir, 'favicon.ico')))
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: 1000 * 60 * 60 * 24 * 365
}))

app.use(routes)

app.listen(app.get('port'), function () {
  console.log('Server is running on ' + app.get('port'))
})
