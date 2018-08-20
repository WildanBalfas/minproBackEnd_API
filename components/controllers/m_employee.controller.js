'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports = exports = function (server) {
    let name = 'm_employee';
    let dbo;

    templateCtrl(server, name);

    server.get('/api/employee-aggregation', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection(name).aggregate([
                { $lookup: { from: "m_company", localField: "m_company_id", foreignField: "_id", as: "company" } },
                { $lookup: { from: "m_user", localField: "created_by", foreignField:"_id", as: "user"}},
                { $lookup: { from: "m_role", localField: "user.m_role_id", foreignField: "_id", as: "role"}},
                {$unwind:{path: "$company", preserveNullAndEmptyArrays: true}},
                {$unwind:{path: "$user", preserveNullAndEmptyArrays: true}},
                {$unwind:{path: "$role", preserveNullAndEmptyArrays: true}},
                { $match : { is_delete : 0 } },
                {
                    $project: {
                        "_id": "$_id",
                        "employee_number": "$employee_number",
                        "firstName": "$first_name",
                        "lastName": "$last_name",
                        "email": "$email",
                        "createdDate": "$createDate",
                        "createdBy": "$created_by",
                        "mCompanyId": "$m_company_id",
                        "mCompanyName": "$company.name",
                        "updateDate": "$updateDate",
                        "updatedBy": "$updated_by",
                        "mRoleName": "$role.name",
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