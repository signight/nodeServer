//通过 new Db(settings.db, new Server(settings.host, settings.port), {safe: true}); 
//设置数据库名、数据库地址和数据库端口创建了一个数据库连接实例，并通过 module.exports 导出该实例
//http://mongodb.github.io/node-mongodb-native/
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
var sever_options={};
var db_options={
        w:-1,// 设置w=-1是mongodb 1.2后的强制要求，见官方api文档
        safe:true,
        logger:{
        doDebug:true,
        debug:function(msg,obj){
            console.log('[debug]',msg);
        },
        log:function(msg,obj){
            console.log('[log]',msg);
        },
        error:function(msg,obj){
            console.log('[error]',msg);
        }
    }
};    
module.exports = new Db(settings.db, new Server(settings.host, settings.port,sever_options),db_options);