var mongoose = require('mongoose')

var ArticleSchema = new mongoose.Schema({
  author: String,
  title: String,
  tags: Array,
  content: String,
  time: {
    type: Date,
    default: Date.now
  },
  comments: [],
  pv: {
    type: Number,
    default: 0
  }
})

//Instance methods
ArticleSchema.methods.speak = function () {
  //console.log(this.sayer)
}

//Statics methods
ArticleSchema.statics.getFive = function () {
  //
}

module.exports = mongoose.model('Article', ArticleSchema)
