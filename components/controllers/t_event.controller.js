'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
    let name = 't_event';
    let dbo;

    templateCtrl(server,name);

   server.get('/api/t_event_aggregation', (req, res, next) => {
       MongoClient.connect(config.dbconn, function (err, db){
           if (err) throw err;
           dbo = db.db(config.dbname);
           dbo.collection(name)
           .aggregate([
            { $lookup: { from: "m_employee", localField: "assign_to", foreignField: "_id", as: "employeeDoc" } },
            { $lookup: { from: "m_user", localField: "employeeDoc._id", foreignField: "m_employee_id", as: "userDoc" } },
            { $lookup: { from: "m_role", localField: "userDoc.m_role_id", foreignField: "_id", as: "roleDoc" } },
            { $unwind: "$employeeDoc" },
            { $unwind: "$userDoc" },
            { $unwind: "$roleDoc" },
            {
                $project: {
                    "_id": 1,
                    "code": 1,
                    "event_name":1,
                    "event_place":1,
                    "request_by": "$employeeDoc.name",
                    "request_date": 1,
                    "m_employee_id": "$userDoc.m_employee_id",
                    "approved_by": "$employeeDoc.name",
                    "createDate": 1,
                    "status":1,
                    "start_date": 1,
                    "end_date":1,
                    "budget":1,
                    "assign_to": "$employeeDoc.name",
                    "note":1,
                    "roleName":"$roleDoc.name",
                    "roleId": "$roleDoc._id"
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