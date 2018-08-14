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
            { $lookup: { from: "m_employee", localField: "request_by", foreignField: "_id", as: "employeeDoc" } },
            { $lookup: { from: "m_user", localField: "employeeDoc._id", foreignField: "m_employee_id", as: "userDoc" } },
            { $lookup: { from: "m_role", localField: "userDoc.m_role_id", foreignField: "_id", as: "roleDoc" } },
            { $unwind: "$employeeDoc" },
            { $unwind: "$userDoc" },
            { $unwind: "$roleDoc" },
            // { $match: {"roleDoc.name": /Staff/ }},
            {
                $project: {
                    "_id": 1,
                    "code": "$code",
                    "event_name":"$event_name",
                    "event_place":"$event_place",
                    "request_by": "$request_by",
                    "requestName" : "$employeeDoc.first_name",
                    "request_date": "$request_date",
                    // "m_employee_id": "$approved_by",
                    "approved_by": "$approved_by",
                    "createDate": "$createDate",
                    "status": 
                    	{
							$cond: { 
               				 if: { $lte: [ "$status", 1 ] }, 
               				 then: "Submitted",
                			 else: {
                   				 $cond: {
                       				 if: { $lte: ["$status", 2]}, 
                       				 then: "In progress", 
                        			 else: "Done"
                    					}
               						 }
           					 }
              		 },
                    
                    "start_date": "$start_date",
                    "end_date":"$end_date",
                    "budget":"$budget",
                    "assign_to": "$employeeDoc.name",
                    "note":"$note",
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