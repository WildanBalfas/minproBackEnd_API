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
                    { $lookup: { from: "m_role", localField: "created_by", foreignField: "_id", as: "roleDoc1" } },
                    { $lookup: { from: "m_role", localField: "updated_by", foreignField: "_id", as: "roleDoc2" } },
                    { $unwind: { path: "$roleDoc2", preserveNullAndEmptyArrays: true } },
                    { $unwind: "$roleDoc1" },
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
                            "created_by": "$roleDoc1.name",
                            "update_by": "$roleDoc2.name",
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
                    dbo.collection('t_souvenir_item').insert(arr, function (err, document) {
                        if (err) throw err;
                        res.send(201, response);
                    });
                });
            });
        });
    });

    server.post('/api/update_souvenir_stock/:id', (req, res, next) => {

        let objID = ObjectID(req.params.id);
        let ent = req.body;
        console.log(objID)
        // console.log(ent)
        let t_souvenir = ent[0];
        let t_souvenir_item = ent[1];
        let arr2 = [];
        console.log(t_souvenir_item)
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            Base.convertToObjectId(t_souvenir);
            Base.setTimeStamp(t_souvenir, req);
            dbo.collection(name).findOneAndUpdate({ '_id': objID }, { $set: t_souvenir }, function (err, response) {
                console.log(response.value._id)
                for (let key in t_souvenir_item) {
                    Base.convertToObjectId(t_souvenir_item[key]);
                    Base.setTimeStamp(t_souvenir_item[key], req);
                    dbo.collection('t_souvenir_item').findOne({ '_id': ObjectID(t_souvenir_item[key]._id) }, function (err, document) {
                        let id = ObjectID(t_souvenir_item[key]._id);
                        let entity = t_souvenir_item[key];
                        // console.log(entity)
                        if (document) {

                            let item = {
                                t_souvenir_id: entity.t_souvenir_id,
                                m_souvenir_id: entity.m_souvenir_id,
                                qty: parseInt(entity.qty),
                                notes: entity.notes,
                            }

                            dbo.collection('t_souvenir_item').findOneAndUpdate({ '_id': id }, { $set: item }, function (err, respon) {
                                if (err) throw err;

                            });

                        } else {
                           
                            
                            
                            let item =
                            {
                                t_souvenir_id: response.value._id,
                                m_souvenir_id: entity.m_souvenir_id,
                                qty: parseInt(entity.qty),
                                notes: entity.notes,


                            }
                            arr2.push(item);



                            console.log(response.value._id)
                            console.log(entity)
                            dbo.collection('t_souvenir_item').insert(arr2, function (err, doc) {
                                if (err) throw err;
                                // res.send(201, response);
                            });
                        }
                      
                        
                    });


                }

                // dbo.collection(name).insert(t_souvenir, function (err, response) {

                res.send(200, response);
            });
        });
    });

}