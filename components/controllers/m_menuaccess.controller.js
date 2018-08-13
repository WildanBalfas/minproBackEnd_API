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
            {
                $addFields:{
                   "menu.m_menu_id":"$m_menu_id"
                }
             },
             {
                $group:{
                   _id:"$m_role_id",
                   code:{
                      $first:"$role.code"
                   },
                   name:{
                      $first:"$role.name"
                   },
                   description:{
                      $first:"$role.description"
                   },
                   menu:{
                      $push:"$menu"
                   }
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