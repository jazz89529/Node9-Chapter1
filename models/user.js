var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

//儲存使用者資訊
User.prototype.save = function(callback) {
    //要存入DB的使用者檔案
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };

    //打開資料庫
    mongodb.open(function (err, db) {
        if(err) {
            return callback(err);//錯誤，傳回err資訊
        }
        //讀取 users collection
        db.collection('users', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);//錯誤，傳回err資訊
            }
            //將使用者資訊插入users collection
            collection.insert(user, {
                safe: true
            }, function(err, user) {
                mongodb.close();
                if(err) {
                    return callback(err);//錯誤，傳回err資訊
                }
                callback(null, user[0]);//成功！ err為null，並傳回儲存後的使用者文件檔
            });
        });
    });
};

//讀取使用者資訊
User.get = function(name, callback) {
    //打開資料庫
    mongodb.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        //讀取 users collection
        db.collection('users', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            //查詢用戶名(name鍵)值為name的文件檔
            collection.findOne({
                name: name
            }, function(err, user) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, user);//成功！ 傳回查詢的使用者資訊
            });
        });
    });
};