var User = require('../models/User'),
  Article = require('../models/Article'),
  crypto = require('crypto'),
  multer = require('multer'),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      var tmpStr = file.originalname
      var str = tmpStr.slice(tmpStr.indexOf('.'), tmpStr.length)
      cb(null, req.session.user.username + str)
    }
  }),
  upload = multer({ storage: storage })



module.exports = function (app) {
  // api
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

  app.post('/api/upload', checkLogin, upload.single('avatar'), function (req, res) {
    res.end('ok')
  })

  app.get('/api/user', function (req, res) {
    User.findOne({
      username: req.query.username
    }, function (error, r) {
      return res.json({
        success: true,
        data: r
      })
    })
  })

  app.put('/api/user', checkLogin, function (req, res) {
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

  app.get('/api/articles', (req, res) => {
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

  app.get('/api/tags', function (req, res) {
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

  app.post('/api/reg', checkNotLogin, (req, res) => {
    var username = req.body.username,
      password = req.body.password,
      password_re = req.body.password_re
    if (username.length < 3 || password.length < 6 || password_re.length < 6) {
      return res.json({
        success: false,
        text: '用户名或密码过于简单'
      })
    }
    if (password !== password_re) {
      return res.json({
        success: false,
        text: '俩次输入的密码不一致'
      })
    }
    var md5 = crypto.createHash('md5'),
      newUser = new User({
        username: username,
        password: md5.update(password).digest('hex')
      })
    User.findOne({
      username: username
    }, (error, r) => {
      if (error) {
        console.error(error)
      } else {
        if (r) {
          return res.json({
            success: false,
            text: '用户名已存在'
          })
        }
        newUser.save((error, r) => {
          if (error) {
            console.error(error)
          } else {
            req.session.user = r
            console.log('++++++++')
            return res.json({
              success: true,
              user: {
                username: r.username,
                description: r.description,
                tx: r.tx
              }
            })
          }
        })
      }
    })
  })

  app.get('/api/logout', checkLogin, function (req, res) {
    req.session.user = null
    return res.json({
      success: true
    })
  })

  app.post('/api/login', checkNotLogin, function (req, res) {
    var md5 = crypto.createHash('md5'),
      username = req.body.username,
      password = md5.update(req.body.password).digest('hex')
    User.findOne({
      username: username,
      password: password
    }, (error, r) => {
      if (!r) {
        return res.json({
          success: false,
          text: '用户名或者密码错误'
        })
      }
      req.session.user = r
      res.json({
        success: true,
        user: {
          username: r.username,
          description: r.description,
          tx: r.tx
        }
      })
    })
  })

  app.get('/api/post', function (req, res) {
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

  app.post('/api/post', checkLogin, function (req, res) {
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

  app.put('/api/post', checkLogin, function (req, res) {
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

  app.delete('/api/post', checkLogin, function (req, res) {
    var _id = req.body._id
    Article.findOneAndRemove({
      _id: _id
    }, function (error, r) {
      return res.json({
        success: true
      })
    })
  })

  app.post('/api/postComment', function (req, res) {
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

  app.get('*', function (req, res) {
    res.render('index', {
      window_user: req.session.user ? JSON.stringify({
        username: req.session.user.username,
        description: req.session.user.description,
        tx: req.session.user.tx
      }) : JSON.stringify({}),
      mainCtx: process.env.mainDomain ? process.env.mainDomain : 'http://localhost:' + app.get('port'),
      ctx: process.env.staticDomain ? process.env.staticDomain : 'http://localhost:' + app.get('port')
    })
  })

}
