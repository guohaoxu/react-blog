var express = require('express'),

  path = require('path'),
  util = require('util'),

  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),

  methodOverride = require('method-override'),
  compression = require('compression'),

  favicon = require('serve-favicon'),
  settings = require('./server/settings'),
  routes = require('./server/routes/index.js'),

  logger = require('morgan'),
  errorHandler = require('errorhandler'),

  mongoose = require('mongoose'),
  dbURL = process.env.dbURL || settings.dbURL,

  MongoStore = require('connect-mongo')(session),
  sessionStore = new MongoStore({
    url: dbURL
  }),

  app = express()

mongoose.Promise = global.Promise
mongoose.connect(dbURL)
  .then(() => console.log('mongoose connection successful'))
  .catch((error) => console.error('error', error))

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
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}))
app.use(compression())

if (app.get('env') === 'development') {
  app.use(logger('dev'))
  app.use(errorHandler())
}

app.use(favicon(path.join(__dirname, '/build/favicon.ico')))
app.use('/static', express.static(path.join(__dirname, 'build'), {
  maxAge: 1000 * 60 * 60 * 24 * 30
}))

routes(app)

app.get('*', function (req, res) {
  res.render('index', {
    window_user: req.session.user ? JSON.stringify({
      username: req.session.user.username,
      description: req.session.user.description,
      tx: req.session.user.tx
    }) : JSON.stringify({}),
    mainCtx: process.env.mainDomain ? process.env.mainDomain : 'http://localhost:' + app.get('port'),
    ctx: process.env.staticDomain ? process.env.staticDomain : 'http://localhost:' + app.get('port')
  })
})

app.listen(app.get('port'), function () {
  console.log('Server is running on ' + app.get('port'))
})
