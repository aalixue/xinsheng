var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require("../config/oneDirection.json");
var url = require("url");
var { checkToken } = require('../config/token');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('addLearn');
});
router.get('/addLearn', function (req, res, next) {
  var con = mysql.createConnection(dbconfig);
  con.connect();
  var data = req.query.data;
  checkToken(data, (r) => {
    // console.log(r);
    con.query("insert into learn(title,content,name,time) values(?,?,?,?)", [r.data.title, r.data.content, r.data.name, r.data.time], function (err, result) {
      if (err) {
        res.send({ ok: false, msg: "发布失败" });
      } else {
        console.log(result);
        res.send({ ok: true, msg: "发布成功" });
      }
    });//不会直接把数据拼接到sql中
  })

  con.end();
});

router.get('/deleteLearn', function (req, res, next) {
  var con = mysql.createConnection(dbconfig);
  con.connect();
  var time = req.query.time;
  var reg = /%20/;
  time = time.replace(reg, ' ');
  let parsedUrl = url.parse(req.url, true);
  let name = parsedUrl.query.name;
  con.query("delete from learn where time=? and name=?", [time, name], function (err, result) {
    if (err) {
      res.send({ ok: false, msg: "删除失败" });
    } else {
      console.log(result);
      res.send({ ok: true, msg: "删除成功" });
    }
  });
  con.end();
});

router.get('/list', function (req, res, next) {
  var con = mysql.createConnection(dbconfig);
  con.connect();
  con.query("select * from learn", function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log({ learnList: result });
      res.render('learn', { learnList: result });
    }
  });
  con.end();
});

module.exports = router;
