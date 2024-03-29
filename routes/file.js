var express = require('express');
var router = express.Router();
// var mysql = require("mysql");
// var dbconfig = require("../configconfig.json");

var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
/* 上传页面. */
router.get('/', function(req, res, next) {
 //res.render('.iews/index');
 res.render('file',{title:'上传文件'});
});
/* 上传 */
router.post('/addFile', function(req, res, next) {
  /* 生成multiparty对象，并配置上传目标路径 */
  var form = new multiparty.Form();
  /* 设置编辑 */
  form.encoding = 'utf-8';
  //设置文件存储路劲
  form.uploadDir = './public/files';
  //设置文件大小限制
  // form.maxFilesSize = 2 * 1024 * 1024;
  // form.maxFields = 1000;  //设置所有文件的大小总和
  //上传后处理
  form.parse(req, function(err, fields, files) {
    var filesTemp = JSON.stringify(files, null, 2);
    if(err) {
      console.log('parse error:' + err);
    }else {
      console.log('parse files:' + filesTemp);
      var inputFile = files.inputFile[0];
      var uploadedPath = inputFile.path;
      var dstPath = './public/files/' + inputFile.originalFilename;
      console.log('filespath='+uploadedPath);
      console.log('dstPath='+dstPath);
      console.log('filesTmp: ' + inputFile);
      console.log('Filename: ' + inputFile.originalFilename);
      //重命名为真实文件名
      // var path1 = inputFile.originalFilename.split('.');
      // var myDate = new Date();
      // path1[0]=path1[0]+myDate.toLocaleString();
      // var newPath = path1.join(".");
      // dstPath = './public/files/' + newPath;
      // dstPath =  dstPath.replace(/\s/g, "");
      // var reg = /:/g;
      // dstPath = dstPath.replace(reg,'-');
      // console.log('dstPath='+dstPath);

      fs.rename(uploadedPath, dstPath, function(err) {
        if(err) {
          console.log('rename error:' + err);
        }else {
          console.log('rename ok');
        }
      })
    }
    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
    // res.json();
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: filesTemp}))
  })
})

module.exports = router;
