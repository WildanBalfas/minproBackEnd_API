'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports = exports = function (server) {
    let name = 'm_user';
    let dbo;

    templateCtrl(server, name);

    server.get('/api/user-aggregation', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection(name).aggregate([
                { $lookup: { from: "m_role", localField: "m_role_id", foreignField: "_id", as: "role" } },
                { $lookup: { from: "m_employee", localField: "m_employee_id", foreignField: "_id", as: "employee" } },
                { $lookup: { from: "m_company", localField: "employee.m_company_id", foreignField: "_id", as: "company" } },
                { $unwind: "$role" },
                { $unwind: "$employee" },
                { $unwind: "$company" },
                {
                    $project: {
                        "_id": 1,
                        "username": 1,
                        "password": 1,
                        "m_role_id": 1,
                        "m_employee_id": 1,
                        "createDate": 1,
                        "createBy": 1,
                        "mRoleCode": "$role.code",
                        "mRoleName": "$role.name",
                        "mRoleDescription": "$role.description",
                        "mEmployeeFirstName": "$employee.first_name",
                        "mEmployeeLastName": "$employee.last_name",
                        "mEmployeeEmail": "$employee.email",
                        "mEmployeemCompanyId": "$employee.m_company_id",
                        "mEmployeemCompanyName": "$company.name",
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