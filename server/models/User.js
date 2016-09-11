var mongoose = require('mongoose'),
  bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  displayName: String,
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  email: String,
  accessToken: String,
  tx: { type: String, default: '/static/uploads/default.jpg' }
})

userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, hashedPassword) => {
      if (err) return next(err)
      user.password = hashedPassword
      next()
    })
  })
})

userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, (err, isMatch) => {
    done(err, isMatch)
  })
}

/**
 *  第三方登录
 */
userSchema.statics.findOrCreate = function (query, query2, cb) {
  var that = this
  this.model('User').findOne({ username: query.username }, function (err, doc) {
    if (err) return cb(err)
    if (!doc) {
      that.model('User').create({
        username: query.username,
        displayName: query2.displayName,
        email: query2.email,
        tx: query2.tx,
        accessToken: query2.accessToken
      }, function (err, doc) {
        if (err) return cb(err)
        cb(null, doc)
      })
    } else {
      cb(null, doc)
    }
  })
}

module.exports = mongoose.model('User', userSchema)
