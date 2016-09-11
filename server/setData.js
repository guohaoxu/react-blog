var User = require('./models/User'),
  mongoose = require('mongoose'),
  settings = require('./settings'),
  dbURL = process.env.dbURL || settings.dbURL

mongoose.connect(dbURL)

// 修改现有数据u
User.update({
  tx: /^static/
},{
  $set: {
    tx: '/static/uploads/default.jpg'
  }
},function () {
  console.log('yet')
})
