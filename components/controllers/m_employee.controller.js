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
                {$unwind:{path: "$company", preserveNullAndEmptyArrays: true}},
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