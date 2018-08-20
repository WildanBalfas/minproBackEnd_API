'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');
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
}