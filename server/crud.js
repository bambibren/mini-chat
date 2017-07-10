var crud = {};
 
crud.insertData = function(db,data,callback) {  
    //连接到表 site
    var collection = db.collection('user-info');
    //插入数据
    collection.insert(data, function(err, result) { 
        if(err)
        {
            callback(false);
            return;
        }
        callback(result);
    });
}

crud.selectData = function(db,query, callback) {  
  //连接到表  
  var collection = db.collection('user-info');
  //查询数据
  collection.find(query).toArray(function(err, result) {
    if(err)
    {
      callback(false);
      return;
    }     
    callback(result);
  });
}

crud.updateData = function(db,query,modifiers,callback) {  
    //连接到表  
    var collection = db.collection('user-info');
    //更新数据
    collection.update(query,modifiers, function(err, result) {
        if(err)
        {
            callback(false);
            return;
        }     
        callback(result);
    });
}
 
crud.delData = function(db,query,callback) {  
  //连接到表  
  var collection = db.collection('user-info');
  //删除数据
  collection.remove(query, function(err, result) {
    if(err)
    {
      callback(false);
      return;
    }     
    callback(result);
  });
}
 

crud.conn = function(option,callback){
  var MongoClient = require('mongodb').MongoClient;
  var DB_CONN_STR = 'mongodb://localhost:27017/chatrooms'; //# 数据库为 chatrooms
  MongoClient.connect(DB_CONN_STR, function(err, db) {
      console.log("连接成功！");
      switch(option.crud){
        case 1:
          crud.insertData(db,option.data,callback);   
        break;
        case 2:
          crud.delData(db,option.query,callback);   
        break;
        case 3:
          crud.updateData(db,option.query,option.modifiers,callback);   
        break;
        case 4:
          crud.selectData(db,option.query,callback);   
        break; 
        default:break;
      }
      db.close();
  });  
}


module.exports = crud;