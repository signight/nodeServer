var express = require('express'); //导入express服务
var path = require('path'); //导入path路径服务
var favicon = require('serve-favicon'); //导入站点ico服务
var logger = require('morgan'); //导入日志记录服务
var cookieParser = require('cookie-parser'); //cookie解析服务
var bodyParser = require('body-parser'); //请求解析服务
var session = require('express-session'); //https://github.com/expressjs/session, express-session是一个提供session服务的中间件，必须在 cookieParser 中间件后启用。
                                          //中文文档http://www.creatshare.com/%E3%80%90%E8%AF%91%E3%80%91express-session-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3.html
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');//flash 是一个在 session 中用于存储信息的特定区域。信息写入 flash ，下一次显示完毕后即被清除。典型的应用是结合重定向的功能
var multer = require('multer'); //导入上传模块

var routes = require('./routes/index'); //导入路由表
var settings = require('./settings'); //导入全局设置

var app = express(); //实例化express服务

// 模板设置
app.set('views', path.join(__dirname, 'views')); //设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('view engine', 'ejs'); //设置视图模板引擎为 ejs。
app.engine('html', require('ejs').__express);
//引入中间件服务
app.use(favicon(__dirname + '/public/favicon.ico')); //设置/public/favicon.ico为favicon图标。
app.use(logger('dev')); //加载日志中间件。
app.use(bodyParser.json()); //加载解析json的中间件。
app.use(bodyParser.urlencoded({extended: false})); //加载解析urlencoded请求体的中间件。
app.use(cookieParser()); //加载解析cookie的中间件。
app.use(express.static(path.join(__dirname, 'public'))); //设置public文件夹为存放静态文件的目录。

app.use(multer({
  dest: './public/images',
  rename: function(fieldname, filename) {
    return filename;
  }
}).array('file', 5));

app.use(session({
  secret: settings.cookieSecret, //用它来对session cookie签名，防止篡改
  key: settings.db, //cookie的名字（原属性名为 key，新版属性名是name）
  resave: false, //强制保存session即使它并没有变化 （默认： true）
  saveUninitialized: true,  //强制将未初始化的session存储。当新建了一个session且未设定属性或值时，它就处于未初始化状态。
                            //在设定一个cookie前，这对于登陆验证，减轻服务端存储压力，权限控制是有帮助的。（默认：true）
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }, //session cookie设置 （ 默认：(default: { path: '/', httpOnly: true, secure: false, maxAge: null })）
     //这里设置30 days
  store: new MongoStore({ //session存储实例              
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
app.use(flash()); //启用flash功能
routes(app); //路由控制器。     

// 捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//导出app实例供其他模块调用。
module.exports = app;