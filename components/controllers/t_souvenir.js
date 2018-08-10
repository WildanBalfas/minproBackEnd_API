'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

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
                    { $lookup: { from: "m_employee", localField: "recieved_by", foreignField: "_id", as: "employee" } },
                    { $unwind: "$employee" },
                    { $match:{ type:"addtional"}},
                    {
                        $project: {
                            "_id": 1,
                            "code": 1,
                            "type":1,
                            "recieved_by": 1,
                            "recieved_date": 1,
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
}