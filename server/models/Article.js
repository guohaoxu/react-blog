var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  Mixed = mongoose.Schema.Types.Mixed

var articleSchema = new mongoose.Schema({
  author: { type: ObjectId, required: true },
  title: String,
  content: String,
  tags: Array,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  comments: [{
    username: String,
    text: String,
    created_at: { type: Date, default: Date.now }
  }],
  pv: { type: Number, default: 0 }
})

module.exports = mongoose.model('Article', articleSchema)
