'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
  let name = 'm_role';
  let dbo;
  
  templateCtrl(server,name);
  
  server.get('/api/m_role_ctrl', (req, res, next) => {
    MongoClient.connect(config.dbconn, function (err, db){
      if (err) throw err;
      dbo = db.db(config.dbname);
      dbo.collection(name)
      .aggregate([
        {$lookup: { from: "m_role", localField: "created_by", foreignField: "_id", as: "roleDoc1" } },
        { $match: {"is_delete": 0}},
        { $unwind: "$roleDoc1" },
        {$project: {
          "_id":"$_id",
          "code":"$code",
          "name":"$name",
          "description":"$description",
          "created_by" : "$roleDoc1.name",
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