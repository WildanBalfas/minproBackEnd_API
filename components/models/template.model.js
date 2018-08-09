'use strict';
const MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let Base = require('../base/base.function');
let dbo;

function Models() {
    this.model = function (req, res, next, name) {
        MongoClient.connect(config.dbconn, async function (err, db) {
            if (err) throw err;
            dbo = db.db(config.myDB);

            if (req.method === 'PUT' || req.method === 'POST') {
                let entity = req.body;
                Base.convertToObjectId(entity);
                Base.setTimeStamp(entity, req);
            }

            if (req.method === 'POST') {
                let entity = req.body;
                Base.isDelete(entity, req);
                await dbo.collection(name).insert(entity, function (err, response) {
                    if (err) throw err;
                    res.send(201, response);
                });
            } else if (req.method === 'GET') {
                if (req.params.id) { // Get By Id
                    let objID = ObjectID(req.params.id);
                    await dbo.collection(name).findOne({ '_id': objID }, function (err, response) {
                        if (err) throw err;
                        res.send(200, response);
                    });
                } else { // Get All
                    await dbo.collection(name).find({}).toArray(function (err, response) {
                        if (err) throw err;
                        res.send(200, response);
                    });
                }
            } else if (req.method === 'PUT') {
                let objID = ObjectID(req.params.id);
                let entity = req.body;
                if(entity.is_delete){
                    entity.is_delete = 1;
                }
                await dbo.collection(name).findOneAndUpdate({ '_id': objID }, { $set: entity }, function (err, response) {
                    if (err) throw err;
                    res.send(200, entity);
                });
            } else if (req.method === 'DELETE') {
                let objID = ObjectID(req.params.id);
                await dbo.collection(name).findOneAndDelete({ '_id': objID }, function (err, response) {
                    if (err) throw err;
                    res.send(200, response);
                });
            }
            db.close();
        });
    }

    this.lastIndex = function(callback) {
        let name='m_product';
        MongoClient.connect(config.dbconn, async function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection(name).aggregate(
                [
                  { $sort: { _id: 1, code: 1 } },
                  {
                    $group:
                      {
                        _id: "$id",
                        code: { $last: "$code" }
                      }
                  }
                ]
             ).toArray(function (err, response) {
                if (err) throw err;
                return  callback(response);
                db.close();
            });
        });

        
    }
}

module.exports = new Models();

