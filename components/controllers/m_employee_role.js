'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
    let name = 'm_employee';
    let dbo;

    // templateCtrl(server,name);

   server.get('/api/m_employee_role', (req, res, next) => {
       MongoClient.connect(config.dbconn, function (err, db){
           if (err) throw err;
           dbo = db.db(config.dbname);
           dbo.collection(name)
           .aggregate([
            { $lookup: { from: "m_user", localField: "_id", foreignField: "m_employee_id", as: "userDoc" } },
            { $lookup: { from: "m_role", localField: "userDoc.m_role_id", foreignField: "_id", as: "roleDoc" } },
            { $unwind: "$userDoc" },
            { $unwind: "$roleDoc" },
            { $match: {"roleDoc.name": /Staff/ }},
            {
                $project: {
                    "_id": 1,
                    "code": "$code",
                    "name":{
                        "first":"$first_name",
                        "last" :"$last_name"
                    },
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