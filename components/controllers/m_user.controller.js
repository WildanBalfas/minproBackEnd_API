'use strict';

const jwt = require('jsonwebtoken');
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
                { $lookup: { from: "m_role", localField: "m_role_id", foreignField: "_id", as: "createdByRole"}},
                { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$createdByRole", preserveNullAndEmptyArrays: true } },
                { $match: { is_delete: 0 } },
                {
                    $project: {
                        "_id": 1,
                        "username": 1,
                        "password": 1,
                        "m_role_id": 1,
                        "m_employee_id": 1,
                        "createDate": 1,
                        "created_by": 1,
                        "mRoleCode": "$role.code",
                        "mRoleName": "$role.name",
                        "mRoleDescription": "$role.description",
                        "mEmployeeFirstName": "$employee.first_name",
                        "mEmployeeLastName": "$employee.last_name",
                        "mEmployeeEmail": "$employee.email",
                        "mEmployeemCompanyId": "$employee.m_company_id",
                        "mEmployeemCompanyName": "$company.name",
                        "createdByRoleName": "$createdByRole.name"
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

    server.post('/api/login', (req, res, next) => {
        MongoClient.connect(config.dbconn, async function (err, db) {
            if (err) throw err;
            let userName = req.body.username;
            let password = req.body.password;
            dbo = db.db(config.dbname);
            await dbo.collection(name)
                .findOne(
                    { 'username': userName, 'password': password },
                    function (err, response) {
                        if (err) throw err;
                        const user = {
                            username: response.username,
                            email: response.password,
                        }
                        jwt.sign({ user }, 'secretkey', (err, token) => {
                            delete response.password;
                            delete response.createDate;
                            delete response.modifyDate;
                            delete response.is_delete;
                            delete response.createdBy;
                            delete response.mCompanyCode;
                            delete response.createdDate;
                            delete response.mCompanyName;
                            delete response.updateDate;
                            response.token = token;
                            res.send(200, response);
                            db.close();
                        });

                    }
                );
        });
    });
}