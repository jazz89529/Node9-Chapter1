var express = require('express');
var router = express.Router();
var crypto = require('crypto');
User = require('../models/user.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' }); //第一個參數為views下的視圖名稱，第二個參數是傳一個title
// }); //套用views中的index.ejs模板並顯示到瀏覽器中

/*router.get('/abc', function(req, res) {
  res.send('Hello World');
});*/
//隨意增加一個route 進行測試

router.get('/', function(req, res, next) {
    res.render('index', { title: '主頁' });
});
router.get('/reg', function(req, res, next) {
    res.render('reg', { title: '註冊' });
});
router.post('/reg', function(req, res, next) {
    var name = req.body.name,
        password = req.body.password,//req.body
        password_re = req.body['password-repeat'];//或req.doby.password-repeat
    //檢驗使用者兩次輸入的密碼是否一致
    if(password_re != password) {
        req.flash('error', '兩次輸入的密碼不一致!');
        return res.redirect('/reg');//傳回註冊頁 重定向功能
    }
    //建立密碼的md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        email: req.body.email
    });
    //檢查用戶是否已經存在
    User.get(newUser.name, function(err, user) {
        if(user) {
            req.flash('error', '用戶已存在!');
            return res.redirect('/reg');//傳回註冊頁
        }
        //如果不存在則新增用戶
        newUser.save(function(err, user) {
            if(err) {
                req.flash('error', err);
                return res.redirect('/reg'); //註冊失敗傳回註冊頁
            }
            req.session.user = user;
            req.flash('success', '註冊成功!');
            res.redirect('/');//註冊成功後傳回主頁
        });
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: '登入' });
});
router.post('/login', function(req, res, next) {
});

router.get('/', function(req, res, next) {
    res.render('index', { title: '主頁' });
});
router.get('/post', function(req, res, next) {
    res.render('post', { title: '發表' });
});
router.post('/post', function(req, res, next) {
});

router.get('/logout', function(req, res, next) {

});


module.exports = router;
// 建立一個路由實例用來監聽主頁的GET請求，並將其匯出