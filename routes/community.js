var express = require('express');
// var expressWs = require('express-ws');
var router = express.Router();
// var { checkToken } = require('../config/token');
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

// expressWs(router);

/* GET users listing. */

// router.ws('/', function (ws, req){
//     ws.send('你连接成功了')
//     ws.on('message', function (msg) {
//         // 业务代码

//     })
// });

router.get('/', function (req, res, next) {
  res.render('addCommunity', { title: 'community' });
});

router.get('/addCommunity', async (req, res, next) => {
  try {
    var title = req.query.title;
    var content = req.query.content;
    var name = req.query.name;
    var clicks = req.query.clicks;
    var time = req.query.time;
    let sql = 'insert into community(title, content, name, clicks, time) values($1,$2,$3,$4,$5)';
    let r = await con.query(sql, [title, content, name, clicks, time]);
    console.log(r.rows);
    res.send({ ok: true, msg: '添加成功！' });
  } catch (err) {
    res.send({ ok: false, msg: '添加失败！' });
  }

});

router.get('/list', async (req, res, next) => {
  try {
    let sql = 'select * from community';
    let r = await con.query(sql, []);
    console.log(r.rows);
    res.render('community',{ communityList: r.rows });
  } catch (err) {
    console.log(err);
  }
})

router.get('/deleteCommunity', async (req, res, next) => {
  try {
    var name = req.query.name;
    var time = req.query.time;
    var reg = /%20/;
    time = time.replace(reg, ' ');
    let sql = 'delete from community where name=$1 and time=$2';
    let r = await con.query(sql, [name, time]);
    console.log(r.rows);
    res.send({ ok: true, msg: "删除成功！" });
  } catch (err) {
    res.send({ ok: false, msg: "删除失败！" });
  }
})

module.exports = router;
