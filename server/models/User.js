var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  description: String,
  email: String,
  tx: {
    type: String,
    default: 'default.jpg'
  }
})

//Instance methods
UserSchema.methods.speak = function () {
  //console.log(this.sayer)
}

//Statics methods
UserSchema.statics.getFive = function () {
  //
}

module.exports = mongoose.model('User', UserSchema)
