'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
    let name = 'm_souvenir';
    let dbo;

    templateCtrl(server,name);

   server.get('/api/m_souvenir_unit', (req, res, next) => {
       MongoClient.connect(config.dbconn, function (err, db){
           if (err) throw err;
           dbo = db.db(config.dbname);
           dbo.collection(name)
           .aggregate([
            { $lookup: { from: "m_unit", localField: "m_unit_id", foreignField: "_id", as: "m_unitDoc"}},
            { $unwind: "$m_unitDoc" },
            { $project: { 
                    "code": "$code", 
                    "name": "$name", 
                    "description" : "$description",
                    "m_unit_id": "$m_unit_id",
                    "unitName": "$m_unitDoc.name",
                    "createDate" : "$createDate",
                    "is_delete" : "$is_delete"				
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