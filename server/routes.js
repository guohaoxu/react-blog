var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('./models/User'),
  path = require('path'),
  Article = require('./models/Article'),
  multer = require('multer'),
  async = require('async')

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

/**
 *  注册 signup
 */
router.post('/api/v1/signup', (req, res, next) => {
  var username = req.body.username,
    password = req.body.password
  User.findOne({ username: username }, (err, doc) => {
    if (err) return next(err)
    if (doc) {
      return res.json({
        success: false,
        text: '用户名已存在'
      })
    }
    var newUser = new User({
      username: username,
      password: password
    })
    newUser.save((err, doc) => {
      if (err) return next(err)
      req.login(doc, function (err) {
        if (err) return next(err)
        res.json({
          success: true,
          data: doc
        })
      })
    })
  })
})

/**
 *  用户名密码 local login
 */
router.post('/api/v1/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) return res.json({
      success: false,
      text: '用户名不存在或密码错误'
    })
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.json({
        success: true,
        data: req.user
      })
    })
  })(req, res, next)
})

/**
 *  Github login
 */
router.get('/auth/github',  passport.authenticate('github'))
router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), function (req, res) {
  res.send('<script>window.opener.location.reload();window.close();</script>')
})

/**
 *  页面初次加载或刷新页面时验证是否已经登录
 */
router.get('/api/v1/auth', function (req, res) {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      data: req.user
    })
  } else {
    res.json({
      success: true,
      data: {}
    })
  }
})

/**
 *  验证是否已经登录中间件
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).json({
      success: false,
      text: '未登录'
    })
  }
}

/**
 *  logout退出
 */
router.get('/api/v1/logout', function (req, res) {
  req.logout()
  res.json({
    success: true,
    data: {}
  })
})

/**
 *  首页 获取文章数据
 */
router.get('/api/v1/articles', (req, res, next) => {
  var p = req.query.p || 1
  Article.find({}).skip(10 * (p - 1)).limit(5).sort({createdAt: -1}).exec((err, docs) => {
    if (err) return next(err)
    async.map(docs, function (item,callback) {
      User.findOne({
        username: item.author
      }, function (err, doc) {
        if (err) return callback(err)
        var tmp = {
          _id: item._id,
          author: item.author,
          title: item.title,
          tags: item.tags,
          content: item.content,
          createdAt: item.createdAt,
          comments: item.comments,
          pv: item.pv,
          tx: doc.tx
        }
        callback(null, tmp)
        })
    }, function (err, items) {
      res.json({
        success: true,
        data: items
      })
    })
  })
})

/**
 *  获取标签页面数据 /tags
 */
router.get('/api/v1/tags', function (req, res) {
  //tag: {tagName: '南京', count: 4, lastUser: 'aaa'}
  Article.find({}).distinct('tags').exec((error, docs) => {
    var results = docs.filter((tag) => tag) //过滤掉 tag为 ''的数据
    async.map(results, function (item, callback) {
      Article.find({ tags: item })
        .sort({ createdAt: -1})
        .exec(function (err, docs) {
          if (err) return callback(err)
          var tmp = {
            tagName: item,
            count: docs.length,
            lastUser: docs[0].author,
            lastDate: docs[0].createdAt
          }
          callback(null, tmp)
        })
    }, function (err, items) {
      items.sort(function (a, b) {
        return a.lastDate - b.lastDate
      })
      console.log(items)
      res.json({
        success: true,
        data: items
      })
    })
  })
})


/**
 *  上传头像
 */
storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'public/uploads')
 },
 filename: function (req, file, cb) {
   var tmpStr = file.originalname
   var str = tmpStr.slice(tmpStr.indexOf('.'), tmpStr.length)
   cb(null, req.user.username + str)
 }
}),
upload = multer({ storage: storage })
router.post('/api/v1/upload', isLoggedIn, upload.single('avatar'), function (req, res) {
  res.end('ok')
})

/**
 *  获取用户信息 /u/:username
 */
router.get('/api/v1/user', function (req, res) {
  User.findOne({
    username: req.query.username
  }, function (error, r) {
    return res.json({
      success: true,
      data: r
    })
  })
})

/**
 *  修改个人资料
 */
router.put('/api/v1/user', isLoggedIn, function (req, res) {
  var imgsrc = req.body.imgsrc || 'default.jpg',
    userdesc = req.body.userdesc
  User.findOneAndUpdate({
    username: req.user.username
  }, {
    $set: {
      tx: imgsrc,
      description: userdesc
    }
  }, function (error, r) {
    return res.json({
      success: true,
      data: {
        username: r.username,
        description: userdesc,
        tx: imgsrc
      }
    })
  })
})


/**
 *  搜索 /search?keyword=a
 */
// router.get('/api/v1/articles', (req, res) => {
//   var p = req.query.p || 1,
//     username = req.query.username,
//     keyword = req.query.keyword,
//     tag = req.query.tag,
//     query
//   if (username !== undefined) {
//     query = {
//       author: username
//     }
//   } else if (keyword !== undefined){
//     var k_reg = new RegExp(keyword, 'i')
//     query = {
//       title: k_reg
//     }
//   } else if (tag !== undefined) {
//     query = {
//       tags: tag
//     }
//   } else {
//     query = {}
//   }
//   Article.find(query).skip(10 * (p - 1)).limit(10).sort({time: -1}).exec((error, r) => {
//     if (error) {
//       console.error(error)
//     } else {
//       var results = []
//       if (!r.length) {
//         return res.json({
//           success: true,
//           data: []
//         })
//       }
//       r.map((article) => {
//         User.findOne({
//           username: article.author
//         }, function (error, doc) {
//           results.push({
//             _id: article._id,
//             author: article.author,
//             title: article.title,
//             tags: article.tags,
//             content: article.content,
//             time: article.time,
//             comments: article.comments,
//             pv: article.pv,
//             tx: doc.tx
//           })
//           if (results.length === r.length) {
//             return res.json({
//               success: true,
//               data: results
//             })
//           }
//         })
//       })
//     }
//   })
// })



router.get('/api/v1/post', function (req, res) {
  var _id = req.query._id
  Article.findOneAndUpdate({
    _id: _id
  }, {
    $inc: {
      pv: 1
    }
  }, function (error, r) {
    User.findOne({
      username: r.author
    }, function (error, doc) {
      return res.json({
        success: true,
        data: {
          _id: r._id,
          author: r.author,
          title: r.title,
          content: r.content,
          pv: r.pv + 1,
          comments: r.comments,
          time: r.time,
          tags: r.tags,
          tx: doc.tx
        }
      })
    })
  })
})

router.post('/api/v1/post', isLoggedIn, function (req, res) {
  var title = req.body.title,
    tags = req.body.tags,
    content = req.body.content,
    newArticle = new Article({
      author: req.user.username,
      title: title,
      tags: tags,
      time: new Date(),
      content: content
    })
  newArticle.save((error, r) => {
    if (error) {
      console.error(error)
    } else {
      return res.json({
        success: true
      })
    }
  })
})

router.put('/api/v1/post', isLoggedIn, function (req, res) {
  var id = req.body._id,
    newContent = req.body.content
  Article.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      content: newContent
    }
  }, function (error, r) {
    return res.json({
      success: true
    })
  })
})

router.delete('/api/v1/post', isLoggedIn, function (req, res) {
  var _id = req.body._id
  Article.findOneAndRemove({
    _id: _id
  }, function (error, r) {
    return res.json({
      success: true
    })
  })
})

router.post('/api/v1/postComment', function (req, res) {
  var _id = req.body._id,
    newComment = {
      username: req.body.comment.username || '',
      website: req.body.comment.website || '',
      content: req.body.comment.content || '',
      time: new Date(),
      id: Date.now()
    }
  Article.findOneAndUpdate({
    _id: _id
  }, {
    $push: {
      comments: newComment
    }
  }, function (error, r) {
    Article.findOne({
      _id: _id
    }, function (error, doc) {
      return res.json({
        success: true,
        data: doc
      })
    })
  })
})


// router.get('*', (req, res, next) => {
//   // res.sendFile(path.join(__dirname, index))
// })

// function checkLogin(req, res, next) {
//   if (!req.session.user) {
//     return res.json({
//       success: false,
//       text: '未登录'
//     })
//   }
//   next()
// }
//
// function checkNotLogin(req, res, next) {
//   if (req.session.user) {
//     return res.json({
//       success: false,
//       text: '已登录'
//     })
//   }
//   next()
// }

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = router
