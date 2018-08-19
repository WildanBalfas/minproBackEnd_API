'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
  let name = 't_promotion';
  let dbo;
  
  templateCtrl(server,name);
  
  server.get('/api/t_promotion_ctrl', (req, res, next) => {
    MongoClient.connect(config.dbconn, function (err, db){
      if (err) throw err;
      dbo = db.db(config.dbname);
      dbo.collection(name)
      .aggregate([
        { $lookup: { from: "m_employee", localField: "request_by", foreignField: "_id", as: "employeeDoc" } },
        { $lookup: { from: "m_user", localField: "employeeDoc._id", foreignField: "m_employee_id", as: "userDoc" } },
        { $lookup: { from: "t_event", localField:"t_event_id", foreignField:"_id", as:"eventDoc"}},
        { $lookup: { from: "t_design", localField:"t_design_id", foreignField:"_id", as:"designDoc"}},
        { $unwind: "$employeeDoc" },
        { $unwind: "$userDoc" },
        { $unwind: "$eventDoc" },
        { $unwind: "$designDoc" },
        {
            $project: {
                "_id":1,
  "code":1,
  "flag_design":1,
  "title":1,
  "t_event_id":"$eventDoc._id",
  "t_design_id":"$designDoc.code",
  "request_by":{
    "first":"$employeeDoc.first_name",
    "last":"$employeeDoc.last_name"
  },
  "request_date":1,
  "approved_by":1,
  "approved_date":1,
  "assign_to":1,
  "close_date":1,
  "note":1,
  "status":1,
  "reject_reason":1,
  "is_delete":1,
  "created_by":{
    "first":"$employeeDoc.first_name",
    "last":"$employeeDoc.last_name"
  },
  "createDate":1,
  "updated_by":1,
  "updateDate":1,
  "event_code":"$eventDoc.code"
            }
        }
    ])
      .toArray(function (err, response) {
        if (err) throw err;
        res.send(200, response);
        db.close();
      });
    });
  });
}