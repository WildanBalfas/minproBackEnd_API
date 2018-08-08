'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports=exports= function(server){
    let name = 'm_menu_access';
    let dbo;

    templateCtrl(server,name);

   server.get('/api/m_menu_access_aggregate', (req, res, next) => {
       MongoClient.connect(config.dbconn, function (err, db){
           if (err) throw err;
           dbo = db.db(config.dbname);
           dbo.collection(name)
           .aggregate([
            { $lookup: { from: "m_role", localField: "m_role_id", foreignField: "_id", as: "role" }}, 
            { $lookup: { from: "m_menu", localField: "m_menu_id", foreignField: "_id", as: "menu" }}, 
            { $unwind: "$role" },
            { $unwind: "$menu" }, 
            { $project: {
                    "_id": 1,
                    "code": 1,
                    "is_delete" : 1,
                    "m_role_id": 1,
                    "createDate" : 1,
                    "createBy" : 1,
                    "role.code": 1,
                    "role.name": 1,
                    "role.description": 1,
                    "m_menu_id" : 1,
                    "menu.code" : 1,
                    "menu.name" :1, 
                    "menu.controller"  : 1
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