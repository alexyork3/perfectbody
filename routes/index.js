//requires modules
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var objectID = require('mongodb').ObjectID;
var assert = require('assert');
var url = "mongodb://pbody:rootroot@ds141088.mlab.com:41088/pbodydb";


/* GET home page. */
/*
  Router LIST :
  1) index
  2) admin-panel
  3) login
  4) register
  5) add-post
  6) delete-post
  7) edit-post
*/
router.get('/', function (req,res) {
  var resultArray = [];
  mongo.connect(url, function (err,db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find().sort({"date": -1});
    cursor.forEach(function (doc,err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function () {
      res.render('index', {items: resultArray, title: "perfectBody - спортивний український"});
      db.close();
    })
  })
})
router.get('/admin-panel', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
  res.render('admin-panel', {title: "Admin panel"});
})
router.post('/insert', function (req,res) {
  var d = new Date().getDate();
  var mo = new Date().getMonth();
  var y = new Date().getFullYear();
  var h = new Date().getHours();
  var m = new Date().getMinutes();
  var dateT = d + "/" + mo + "/" + y + " " + h + ":" + m ;
  var item = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    author: req.body.author,
    date: dateT
  }
  mongo.connect(url, function (err,db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item,function (err, result) {
      assert.equal(null, err);
      console.log("Inserted!");
      db.close();
    })
  })
  res.redirect('/');
})
router.get('/admin-panel/delete-post', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
  var resultArray = [];
  mongo.connect(url, function (err,db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function (doc, err) {
      assert.equal(null,err);
      resultArray.push(doc);
    }, function () {
      res.render('delete-post', {items: resultArray, title: "Delete Post"});
      db.close();
    })
  })
})
router.get('/admin-panel/login', function (req,res) {
  res.render('admin-panel-login');
})
router.post('/admin-panel/login', function(req,res) {
  var user = {
    login: req.body.login,
    password: req.body.password
  };
  mongo.connect(url, function(err,db) {
    if(err) {
      assert.equal(null, err);
    }
    else 
    {
      db.collection('admin-list').findOne({login: user.login, password: user.password}, function(err, user){
        if(err) {
          return res.status(500).send("Error FIND !")
        }
        else if (!user) {
          return res.status(401).send("Error User!")
        }
        else {
          req.session.user = user;
          res.redirect('/admin-panel');
        }
      })
    }
  })
})
router.get('/admin-panel/logout', function(req,res) {
  req.session.destroy(function(err) {
    if(err) asser.equal(null, err);
  });
  res.redirect('/');
});
router.get('/admin-panel/edit-post', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
    var resultOfFind = [];
      mongo.connect(url, function (err, db) {
      assert.equal(null ,err);
      var cursor = db.collection('user-data').find();
      cursor.forEach( function(doc, err) {
        assert.equal(null, err);
        resultOfFind.push(doc);
      }, function () {
        res.render('edit-post', {items: resultOfFind, title: "Edit Post"});
        db.close();
      });
    })
})
router.get('/admin-panel/add-post', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
  res.render('insert', {title: 'Add Post'});

})

router.get('/admin-panel/delete-post/id', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
  var title = req.query.title;
  var id = req.query.post;
  mongo.connect(url, function (err,db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id" : objectID(id)}, function (err,result) {
      assert.equal(null,err);
      console.log("Post deleted");
      db.close();
      res.redirect('/');
    });
  })
})
router.get('/posts/id', function(req,res) {
  var id = req.query.post;
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    if(err) assert.equal(null,err);
    var cursor = db.collection('user-data').find({"_id" : objectID(id)});
    cursor.forEach(function(doc, err) {
      if(err) assert.equal(null,err);
      resultArray.push(doc);
    }, function() {
      res.render('post-item', {items: resultArray});
      db.close();
    })
  }) 
})
router.get('/admin-panel/edit-post/id', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
  var resultArray = [];
  console.log("Post is being found");
  var id = req.query.post;
  console.log(id);
  mongo.connect(url, function (err,db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find({"_id" : objectID(id)});
    cursor.forEach(function (doc,err) {
      assert.equal(null, err) ;
      resultArray.push(doc);
    }, function () {
      res.render('edit-item', {items: resultArray});
      db.close();
    })
  })
})
router.post('/admin-panel/edit-post/update', function(req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
   var date = new Date();
  var dateT = date.toTimeString();
  dateT = dateT.split(' ')[0];
  var id = req.query.post;
  var item = {
    title: req.body.title,
    image: req.body.image,
    content : req.body.content,
    author : req.body.author,
    date : dateT
  };
  mongo.connect(url, function(err,db) {
    assert.equal(null ,err);
    db.collection('user-data').updateOne({"_id" : objectID(id)}, {$set: item}, function(err) {
      assert.equal(null, err);
      console.log("data is update");
      res.redirect('/');
      db.close();
    });
  })
})
router.get('/admin-panel/settings', function (req,res) {
  if(!req.session.user) {
    res.redirect('/admin-panel/login');
  }
  res.render('settings.hbs');
})
module.exports = router;
