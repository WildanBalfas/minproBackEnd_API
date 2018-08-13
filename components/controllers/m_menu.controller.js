'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
  let name = 'm_menu';
  let dbo;
  
  templateCtrl(server,name);
  
  server.get('/api/m_menu_view', (req, res, next) => {
    MongoClient.connect(config.dbconn, function (err, db){
      if (err) throw err;
      dbo = db.db(config.dbname);
      dbo.collection(name)
      .aggregate([
        {$lookup:{from:"m_menu", localField:"parent_id", foreignField:"_id", as:"sub-menu"}},
        {$unwind:{path: "$sub-menu", preserveNullAndEmptyArrays: true}},
        {$project: {
          "_id":"$_id",
          "code":"$code",
          "name":"$name",
          "parent":"$sub-menu.name",
          "controller":"$controller",
          "parent_id":"$parent_id",
          "createDate": 1,
          "updateDate": 1,
          "is_delete" : 1,
        }}
      ])
      .toArray(function (err, response) {
        if (err) throw err;
        res.send(200, response);
        db.close();
      });
    });
  });
}