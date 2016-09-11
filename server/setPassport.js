var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  GithubStrategy = require('passport-github').Strategy,
  User = require('./models/User')

module.exports = function () {
  /**
   *  本地登录
   */
  passport.use('local', new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: "Incorrect username!"})
      }
      user.checkPassword(password, function (err, isMatch) {
        if (err) return done(err)
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Incorrect password!' })
        }
      })
    })
  }))
  /**
   *  第三方Github登陆
   */
  passport.use(new GithubStrategy({
    clientID: '945b550396ae11844a1a',
    clientSecret: 'f093613f65901568ef4767a11ce769235a11037d',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  }, function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      username: profile.username
    }, {
      displayName: profile.displayName,
      email: profile.emails[0].value,
      tx: profile.photos[0].value,
      accessToken: accessToken
    }, function (err, user) {
      return cb(err, user)
    })
  }))

  /**
   *  序列化session
   */
  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

}
