var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express(); //建立一個express實例app。

app.use(session({
    secret: settings.cookieSecret,
    key: settings.db, //cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port,
        url: 'mongodb://localhost:27017/blog',
    }),
    resave: true,//多加上的
    saveUninitialized: true//多加上的
}));

// view engine setup
app.set('views', path.join(__dirname, 'views')); //設定views資料價為存放視圖的資料夾，dirname為全域變數，儲存目前正在執行的檔案所在的資料夾。
app.set('view engine', 'ejs'); //設定視圖範樣版引擎為ejs
app.use(flash()); //使用flash

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); //設定favicon圖示
app.use(logger('dev')); //載入日誌中介軟體
app.use(bodyParser.json()); //載入解析json的中介軟體
app.use(bodyParser.urlencoded({ extended: false })); //載入解析urlencoded請求體的中介軟體
app.use(cookieParser()); //載入解析cookie的中介軟體
app.use(express.static(path.join(__dirname, 'public'))); //設定public資料夾為存放靜態檔案的資料夾

app.use('/', index); //路由控制器
app.use('/users', users); //路由控制器

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); //發現404錯誤，並轉發到錯誤處理器。

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); //開發環境下的錯誤處理器，將錯誤資訊套用於err模板，並顯示到瀏覽器中




module.exports = app; //匯出app供其他模組使用
