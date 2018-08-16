'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports = exports = function (server) {
    let name = 't_design';
    let dbo;

    templateCtrl(server, name);

    server.get('/api/t-design-aggregation', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection(name).aggregate([
                { $lookup: { from: 'm_employee', localField: 'request_by', foreignField: '_id', as: 'requestByDoc' } },
                { $lookup: { from: 't_event', localField: 't_event_id', foreignField: '_id', as: 'eventDoc' } },
                { $lookup: { from: 'm_employee', localField: 'request_by', foreignField: '_id', as: 'approvedByDoc' } },
                { $lookup: { from: 'm_employee', localField: 'assign_to', foreignField: '_id', as: 'assignToDoc' } },
                { $lookup: { from: 'm_user', localField: 'created_by', foreignField: '_id', as: 'createdByDoc' } },
                { $lookup: { from: 'm_user', localField: 'updated_by', foreignField: '_id', as: 'updatedByDoc' } },
                { $unwind: '$requestByDoc' },
                {$unwind:{path: "$eventDoc", preserveNullAndEmptyArrays: true}},
                {$unwind:{path: "$approvedByDoc", preserveNullAndEmptyArrays: true}},
                {$unwind:{path: "$assignToDoc", preserveNullAndEmptyArrays: true}},
                {$unwind:{path: "$createdByDoc", preserveNullAndEmptyArrays: true}},
                {$unwind:{path: "$updatedByDoc", preserveNullAndEmptyArrays: true}},
                {
                    $project: {
                        "_id": 1,
                        "code": 1,
                        "t_event_id": 1,
                        "title_header": 1,
                        "request_by": 1,
                        "request_date": 1,
                        "approved_by": 1,
                        "approved_date": 1,
                        "assign_to": 1,
                        "closed_date": 1,
                        "note": 1,
                        "status": 1,
                        "reject_reason": 1,
                        "created_by": 1,
                        "updated_by": 1,
                        "createDate": 1,
                        "updateDate": 1,
                        "requestFirstName": "$requestByDoc.first_name",
                        "requestLastName": "$requestByDoc.last_name",
                        "tEventName": "$eventDoc.event_name",
                        "approvedFirstName": "$approvedByDoc.first_name",
                        "approvedLastName": "$approvedByDoc.last_name",
                        "assignToFirstName": "$assignToDoc.first_name",
                        "assignToLastName": "$assignToDoc.last_name",
                        "createdByUsername": "$createdByDoc.username",
                        "updatedByUsername": "$updatedByDoc.username"
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