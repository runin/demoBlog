// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/conf');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');
 
 // 当一个连接池不再需要使用时，用连接池对象的end方法关闭连接池。pool.end();
// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));
 
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};
 
module.exports = {
	add: function (req, res, next) {
		pool.getConnection(function(err, connection) {//从连接池中取出连接。getConnection方法
			// 获取前台页面传过来的参数
			var param = req.query || req.params;
			// 建立连接，向表中插入值
			// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.insert, [param.name, param.age], function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg:'增加成功'
					};    
				}
 
				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, result);
 
				// 释放连接 
				connection.release();//当连接不再使用时，用connection对象的release方法将其归还到连接池中。connection.release();
			});
		});
	}
};