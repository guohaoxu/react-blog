var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  Mixed = mongoose.Schema.Types.Mixed

var articleSchema = new mongoose.Schema({
  author: { type: ObjectId, required: true },
  title: String,
  content: String,
  tags: Array,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
  comments: [],
  pv: { type: Number, default: 0 }
})

articleSchema.pre('save', (next) => {
  //
  return next()
})
articleSchema.pre('remove', (next) => {
  //
  return next()
})
//Instance methods
articleSchema.methods.speak = () => {
  //console.log(this.sayer)
}

//Statics methods
articleSchema.statics.getCountOfBooksById = (bookdId, cb) => {
  //
  return cb(count)
}

module.exports = mongoose.model('Article', articleSchema)
