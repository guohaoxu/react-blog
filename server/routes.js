var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('./models/User'),
  path = require('path'),
  Article = require('./models/Article'),
  crypto = require('crypto'),
  multer = require('multer'),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      var tmpStr = file.originalname
      var str = tmpStr.slice(tmpStr.indexOf('.'), tmpStr.length)
      cb(null, req.session.user.username + str)
    }
  }),
  upload = multer({ storage: storage })

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})


// router.use((req, res, next) => {
//   res.locals.currentUser = req.user
//   res.locals.errors = req.flash('error'),
//   res.locals.infos = req.flash('info')
// })

// router.get('/', (req, res, next) => {
//   User.find()
//       .sort({ createdAt: 'descending' })
//       .exec((err, users) => {
//         if (err) return next(err)
//         res.render('index', { users: users })
//       })
// })

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
      res.json({
        success: true,
        data: doc
      })
    })
  })
})

/**
 *  登录login
 */
router.post('/api/v1/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), function (req, res) {
  res.json({
    success: true,
    data: req.user
  })
})

/**
 *  登录Github
 */
router.get('/auth/github',  passport.authenticate('github'))
router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), function (req, res) {
  res.send('<script>window.opener.location.reload();window.close();</script>')
})

/*
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
  res.redirect('/')
})




// router.post('/api/v1/login', function (req, res) {
//   var md5 = crypto.createHash('md5'),
//     username = req.body.username,
//     password = md5.update(req.body.password).digest('hex')
//   User.findOne({
//     username: username,
//     password: password
//   }, (error, r) => {
//     if (!r) {
//       return res.json({
//         success: false,
//         text: '用户名或者密码错误'
//       })
//     }
//     req.session.user = r
//     res.json({
//       success: true,
//       user: {
//         username: r.username,
//         description: r.description,
//         tx: r.tx
//       }
//     })
//   })
// })

/**
 *  logout退出
 */
// router.get('/api/v1/logout', checkLogin, function (req, res) {
//   req.session.user = null
//   return res.json({
//     success: true
//   })
// })

// old
router.post('/api/v1/upload', checkLogin, upload.single('avatar'), function (req, res) {
  res.end('ok')
})

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

router.put('/api/v1/user', checkLogin, function (req, res) {
  var imgsrc = req.body.imgsrc || 'default.jpg',
    userdesc = req.body.userdesc
  User.findOneAndUpdate({
    username: req.session.user.username
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

router.get('/api/v1/articles', (req, res) => {
  var p = req.query.p || 1,
    username = req.query.username,
    keyword = req.query.keyword,
    tag = req.query.tag,
    query
  if (username !== undefined) {
    query = {
      author: username
    }
  } else if (keyword !== undefined){
    var k_reg = new RegExp(keyword, 'i')
    query = {
      title: k_reg
    }
  } else if (tag !== undefined) {
    query = {
      tags: tag
    }
  } else {
    query = {}
  }
  Article.find(query).skip(10 * (p - 1)).limit(10).sort({time: -1}).exec((error, r) => {
    if (error) {
      console.error(error)
    } else {
      var results = []
      if (!r.length) {
        return res.json({
          success: true,
          data: []
        })
      }
      r.map((article) => {
        User.findOne({
          username: article.author
        }, function (error, doc) {
          results.push({
            _id: article._id,
            author: article.author,
            title: article.title,
            tags: article.tags,
            content: article.content,
            time: article.time,
            comments: article.comments,
            pv: article.pv,
            tx: doc.tx
          })
          if (results.length === r.length) {
            return res.json({
              success: true,
              data: results
            })
          }
        })
      })
    }
  })
})

router.get('/api/v1/tags', function (req, res) {
  //tag: {tagName: '南京', count: 4, lastUser: 'aaa'}
  var tags = []
  Article.find({}).distinct('tags').exec((error, r) => {
    var results = r.filter((tag) => tag)
    if (!r.length) {
      return res.json({
        success: true,
        data: []
      })
    }
    results.map((tag) => {
      var tmp = {}
      tmp.tagName = tag
      Article.find({
        tags: tag
      }).sort({time: -1}).exec((error, docs) => {
        tmp.count = docs.length
        tmp.lastUser = docs[0].author
        tags.push(tmp)
        if (tags.length === results.length) {
          return res.json({
            success: true,
            data: tags
          })
        }
      })
    })
  })
})

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

router.post('/api/v1/post', checkLogin, function (req, res) {
  var title = req.body.title,
    tags = req.body.tags,
    content = req.body.content,
    newArticle = new Article({
      author: req.session.user.username,
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

router.put('/api/v1/post', checkLogin, function (req, res) {
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

router.delete('/api/v1/post', checkLogin, function (req, res) {
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

function checkLogin(req, res, next) {
  if (!req.session.user) {
    return res.json({
      success: false,
      text: '未登录'
    })
  }
  next()
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    return res.json({
      success: false,
      text: '已登录'
    })
  }
  next()
}

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = router
