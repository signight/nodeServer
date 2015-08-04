var mongodb = require('./db');

function User (user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}
//存储用户信息
User.prototype.save = function(callback) {
    //要存入数据库的用户文档
    var user = {
        name : this.name,
        password : this.password,
        email : this.email
    };
    //打开数据库
    
};
module.exports = User;