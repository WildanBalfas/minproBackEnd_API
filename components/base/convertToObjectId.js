'use strict';
const ObjectId = require('mongodb').ObjectID;
module.exports = function (entity) {
    /**
     * Employee objectId
     */
    let objEntity = [
        'created_by',
        'updated_by',
        'm_company_id',
        'parent_id',
        'm_role_id',
        'm_menu_id',
        'm_employee_id'
    ];

    for (let key in entity) {
        let check = objEntity.includes(key);
        if (check) {
            let value = entity[key];
            entity[key] = ObjectId(value);
        }
    }
}