var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  description: String,
  email: String,
  tx: {
    type: String,
    default: 'static/uploads/default.jpg'
  }
})

userSchema.virtual('info')
  .get(() => {
    return {
      username: this.username,
      description: this.description,
      tx: this.tx
    }
  })

//Instance methods
userSchema.methods.speak = () => {
  //console.log(this.sayer)
}

//Statics methods
userSchema.statics.getFive = () => {
  //
}

module.exports = mongoose.model('User', userSchema)
