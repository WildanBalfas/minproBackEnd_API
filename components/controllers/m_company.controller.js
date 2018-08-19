'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
    let name = 'm_company';
    let dbo;

    templateCtrl(server,name);

   server.get('/api/m_company_aggregation', (req, res, next) => {
       MongoClient.connect(config.dbconn, function (err, db){
           if (err) throw err;
           dbo = db.db(config.dbname);
           dbo.collection(name)
           .aggregate([
            // { $lookup: { from: "m_employee", localField: "created_by", foreignField: "_id", as: "employeeDoc" } },
            // { $lookup: { from: "m_user", localField: "employeeDoc._id", foreignField: "m_employee_id", as: "userDoc" } },
            { $lookup: { from: "m_role", localField: "created_by", foreignField: "_id", as: "roleDoc1" } },
            { $lookup: { from: "m_role", localField: "updated_by", foreignField: "_id", as: "roleDoc2" } },
            { $match: {"is_delete": 0}},
            // { $unwind: "$employeeDoc"},
            // { $unwind: "$userDoc" },
            { $unwind: {path: "$roleDoc2", preserveNullAndEmptyArrays: true}},
            { $unwind: "$roleDoc1" },
            { $project: { 
                    "code": "$code", 
                    "name": "$name", 
                    "address" : "$address",
                    "email": "$email",
                    "phone": "$phone",
                    "createDate" : "$createDate",
                    "created_by" : "$roleDoc1.name",
                    "updateDate": "$roleDoc2.name",
                    "createDate": "$createDate",
                    "is_delete" : "$is_delete",		
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