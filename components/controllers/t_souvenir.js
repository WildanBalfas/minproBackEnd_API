'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');
let ObjectID = require('mongodb').ObjectID;
let Base = require('../base/base.function');
let Model = require('../models/template.model');

module.exports = exports = function (server) {
    let name = 't_souvenir';
    let dbo;

    templateCtrl(server, name);

    server.get('/api/t_souvenir_stock', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection(name)
                .aggregate([
                    { $lookup: { from: "m_employee", localField: "received_by", foreignField: "_id", as: "employee" } },
                    { $unwind: "$employee" },
                    { $match: { type: "addtional" } },
                    {
                        $project: {
                            "_id": 1,
                            "code": 1,
                            "type": 1,
                            "note": 1,
                            "received_by": 1,
                            "received_date": 1,
                            "createDate": 1,
                            "createBy": 1,
                            "EmployeeFirstName": "$employee.first_name",
                            "EmployeeLastName": "$employee.last_name",


                        }
                    }
                ]).toArray(function (err, response) {
                    if (err) throw err;
                    res.send(200, response);
                    db.close();
                });
        });
    });

    server.get('/api/t_souvenir_item', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection('t_souvenir_item')
                .aggregate([
                    { $lookup: { from: 'm_souvenir', localField: 'm_souvenir_id', foreignField: '_id', as: 'souvenir' } },
                    { $unwind: { path: "$souvenir", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            "_id": 1,
                            "t_souvenir_id": 1,
                            "m_souvenir_id": 1,
                            "qty": 1,
                            "notes": 1,
                            "created_by": 1,
                            "updated_by": 1,
                            "createDate": 1,
                            "updateDate": 1,
                            "souvenirName": "$souvenir.name",
                        }
                    }
                ]).toArray(function (err, response) {
                    if (err) throw err;
                    res.send(200, response);
                    db.close();
                });
        });
    });

    server.post('/api/add_souvenir_stock', (req, res, next) => {
        Model.lastIndexOfCollection(name, function (response) {
            let entity = req.body;
            let t_souvenir = entity[0];
            let t_souvenir_item = entity[1];
            MongoClient.connect(config.dbconn, function (err, db) {
                if (err) throw err;
                dbo = db.db(config.dbname);
                Base.convertToObjectId(t_souvenir);
                Base.setTimeStamp(t_souvenir, req);

                Base.generateCode(t_souvenir, name, response);
                dbo.collection(name).insert(t_souvenir, function (err, response) {
                    if (err) throw err;
                    let arr = [];
                    for (let key in t_souvenir_item) {
                        Base.convertToObjectId(t_souvenir_item[key]);
                        Base.setTimeStamp(t_souvenir_item[key], req);

                        let item =
                        {
                            t_souvenir_id: response.ops[0]._id,
                            m_souvenir_id: t_souvenir_item[key].m_souvenir_id,
                            qty: parseInt(t_souvenir_item[key].qty),
                            notes: t_souvenir_item[key].notes,
                            createDate: t_souvenir_item[key].createDate,
                            updateDate: t_souvenir_item[key].updateDate


                        }
                        arr.push(item);
                    }
                    dbo.collection('t_souvenir_item').insert(arr, function (err, response) {
                        if (err) throw err;
                        res.send(201, response);
                    });
                });
            });
        });
    });

    server.put('/api/update_souvenir_stock/:id', (req, res, next) => {
        
            let objID = ObjectID(req.params.id);
            let entity = req.body;
            let t_souvenir = entity[0];
            let t_souvenir_item = entity[1];
            // console.log(t_souvenir_item)
            MongoClient.connect(config.dbconn, function (err, db) {
                if (err) throw err;
                dbo = db.db(config.dbname);
                Base.convertToObjectId(t_souvenir);
                Base.setTimeStamp(t_souvenir, req);
                dbo.collection(name).findOneAndUpdate({ '_id': objID }, { $set: t_souvenir }, function (err, response) {
                   
                    // res.send(200, entity);
               
                console.log(response.value._id)
                for (let key in t_souvenir_item) {
                    Base.convertToObjectId(t_souvenir_item[key]);
                    dbo.collection('t_souvenir_item').findOne({ '_id': ObjectID(t_souvenir_item[key]._id) }, function (err, document) {
                        if (document) {
                            let id = ObjectID(t_souvenir_item[key]._id) ;
                            let entity = t_souvenir_item[key];
                            console.log(t_souvenir)
                            
                            console.log(entity)
                            
                            dbo.collection('t_souvenir_item').findOneAndUpdate({ '_id': id }, { $set:entity}, function (err, respon) {
                            //     if (err) throw err;
                                // res.send(200, entity);
                                console.log(respon)
                            });
                            
                        } else {
                            // Base.convertToObjectId(t_souvenir_item[key]);
                            // Base.setTimeStamp(t_souvenir_item[key], req);
                            // let arr = [];
                            // let item =
                            // {
                            //     t_souvenir_id: response.ops[0]._id,
                            //     m_souvenir_id: t_souvenir_item[key].m_souvenir_id,
                            //     qty: parseInt(t_souvenir_item[key].qty),
                            //     notes: t_souvenir_item[key].notes,
                            //     createDate: t_souvenir_item[key].createDate,
                            //     updateDate: t_souvenir_item[key].updateDate
    
    
                            // }
                            // arr.push(item);
                            console.log('tidak')
                        }
                        //console.log({document: document});
                    });


                }


                // dbo.collection(name).insert(t_souvenir, function (err, response) {
                //     if (err) throw err;
                //     let arr = [];
                //     for (let key in t_souvenir_item) {
                //         Base.convertToObjectId(t_souvenir_item[key]);
                //         Base.setTimeStamp(t_souvenir_item[key], req);

                //         let item =
                //         {
                //             t_souvenir_id: response.ops[0]._id,
                //             m_souvenir_id: t_souvenir_item[key].m_souvenir_id,
                //             qty: parseInt(t_souvenir_item[key].qty),
                //             notes: t_souvenir_item[key].notes,
                //             createDate: t_souvenir_item[key].createDate,
                //             updateDate: t_souvenir_item[key].updateDate


                //         }
                //         arr.push(item);
                //     }
                //     dbo.collection('t_souvenir_item').insert(arr, function (err, response) {
                //         if (err) throw err;
                //         res.send(201, response);
                //     });
                // });
            });
        });
    });
    
}