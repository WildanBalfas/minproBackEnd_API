'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');
const Base = require('../base/base.function');
let ObjectID = require('mongodb').ObjectID;

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
                { $unwind: { path: "$eventDoc", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$approvedByDoc", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$assignToDoc", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$createdByDoc", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$updatedByDoc", preserveNullAndEmptyArrays: true } },
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
                        "tEventCode": "$eventDoc.code",
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

    server.get('/api/t-design-item-aggregation', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection('t_design_item').aggregate([
                { $lookup: { from: 't_design', localField: 't_design_id', foreignField: '_id', as: 'design' } },
                { $lookup: { from: 'm_product', localField: 'm_product_id', foreignField: '_id', as: 'product' } },
                { $unwind: { path: "$design", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
                { $match: { "is_delete": 0 } },
                {
                    $project: {
                        "_id": 1,
                        "t_design_id": 1,
                        "m_product_id": 1,
                        "title_item": 1,
                        "request_pic": 1,
                        "start_date": 1,
                        "end_date": 1,
                        "request_due_date": 1,
                        "note": 1,
                        "created_by": 1,
                        "updated_by": 1,
                        "createDate": 1,
                        "updateDate": 1,
                        "is_delete": 1,
                        "mProductCode": "$product.code",
                        "mProductName": "$product.name",
                        "mProductDescription": "$product.description",
                        "tDesignCode": "$design.code",
                        "tDesignTitleHeader": "$design.title_header",
                        "tDesignRequestBy": "$design.request_by",
                        "tDesignRequestDate": "$design.request_date",
                        "tDesignApprovedBy": "$design.approved_by",
                        "tDesignApprovedDate": "$design.approved_date",
                        "tDesignAssignTo": "$design.assign_to",
                        "tDesignClosedDate": "$design.closed_date",
                        "tDesignNote": "$design.note",
                        "tDesignStatus": "$design.status",
                        "tDesignRejectReason": "$design.reject_reason",
                        "tDesignCreatedBy": "$design.created_by",
                        "tDesignUpdatedBy": "$design.updated_by",
                        "tDesignCreateDate": "$design.createDate",
                        "tDesignUpdateDate": "$design.updateDate",
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

    server.get('/api/t-design-by-id/:id', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            let objID = ObjectID(req.params.id);
            dbo = db.db(config.dbname);
            dbo.collection('t_design_item').find({"t_design_id": objID})
                .toArray(function (err, response) {
                    if (err) throw err;
                    Base.changeStatus(response);
                    res.send(200, response);
                    db.close();
                });
        });
    });

    server.get('/api/t-design-items', (req, res, next) => {
        MongoClient.connect(config.dbconn, function (err, db) {
            if (err) throw err;
            dbo = db.db(config.dbname);
            dbo.collection('t_design_item').aggregate([
                { $lookup: { from: 'm_product', localField: 'm_product_id', foreignField: '_id', as: 'product' } },
                { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        "_id": 1,
                        "t_design_id": 1,
                        "m_product_id": 1,
                        "title_item": 1,
                        "request_pic": 1,
                        "start_date": 1,
                        "end_date": 1,
                        "request_due_date": 1,
                        "note": 1,
                        "created_by": 1,
                        "updated_by": 1,
                        "createDate": 1,
                        "updateDate": 1,
                        "is_delete": 1,
                        "mProductCode": "$product.code",
                        "mProductName": "$product.name",
                        "mProductDescription": "$product.description",
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