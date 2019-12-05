var express = require('express');
var router = express.Router();
const pg = require('pg');
var con = new pg.Client({
  user: 'postgres',
  password: 'duxiu2017!',
  port: 5432,
  database: 'xinsheng',
  host: '139.155.44.190'
});
//处理error事件，如果出错则退出
con.on('error', err => {
  console.log(err);
  process.exit(1);
});

con.connect();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('usersLogin', { title: '用户登录' });
});

router.get('/addUsers', function (req, res, next) {
  res.render('usersPost', { title: '用户注册' });
});

router.get('/usersChange', function (req, res, next) {
  res.render('change', { title: '完善资料' });
});
//用户注册
router.get('/addUser', async (req, res, next) => {
  try {
    var pic = null;
    var name = req.query.name;
    var tel = req.query.tel;
    var college = null;
    var sex = null;
    var pwd = req.query.pwd;
    let sql = 'insert into users(pic, name, tel, college, sex, pwd) values($1,$2,$3,$4,$5,$6)';
    let r = await con.query(sql, [pic, name, tel, college, sex, pwd]);
    console.log(r.rows);
    res.send({ ok: true, msg: '注册成功！' });
  } catch (err) {
    res.send({ ok: false, msg: '注册失败！' });
  }
});

router.get('/change', async (req, res, next)=> {
  try {
      var pic = req.query.picBase;
      var college = req.query.college;
      var sex = req.query.sex;
      var name = req.query.name;
      let sql = 'update users set pic=$1,college=$2,sex=$3 where name=$4';
      let r1 = await con.query(sql, [pic,college, sex, name]);
      console.log(r1.rows);
      res.send({ ok: true, msg: '修改成功！' });
  } catch (err) {
    res.send({ ok: false, msg: '修改失败！' });
  }
});

router.get('/list', async (req, res, next) => {
  try {
    let sql = 'select * from users';
    let r = await con.query(sql, []);
    res.send({ usersList: r.rows });
  } catch (err) {
    console.log(err);
  }
})
//用户登录
router.get('/login', async (req, res, next) => {
  try {
    let sql = 'select pwd from users WHERE name=$1';
    let r = await con.query(sql, [req.query.name]);
    var message = JSON.parse(JSON.stringify(r.rows));
    if (!message.length) {
      res.send({ ok: false, msg: '此用户不存在！' });
    }
    else if (message[0].pwd == req.query.pwd) {
      res.send({ ok: true, msg: '登陆成功！' });
    }
    else {
      res.send({ ok: false, msg: '密码错误！' });
    }
  } catch (err) {
    res.send({ ok: false, msg: '此用户不存在！' });
  }
});


module.exports = router;

