var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  Mixed = mongoose.Schema.Types.Mixed

var articleSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: String,
  content: String,
  tags: Array,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: [{
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  pv: { type: Number, default: 0 }
})

module.exports = mongoose.model('Article', articleSchema)
