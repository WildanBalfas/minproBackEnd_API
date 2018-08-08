'use strict';
const ObjectId = require('mongodb').ObjectID;
function BaseFunction() {
    /**
     * Convert id relasi yang ada di table lain
     */
    this.convertToObjectId = function (entity) {
        let objEntity = [
            'created_by',
            'updated_by',
            'm_company_id',
            'parent_id',
            'm_role_id',
            'm_menu_id',
            'm_employee_id',
            'm_unit_id'
        ];
        if (entity.length > 0) {
            for (let i = 0; i < entity.length; i++) {
                let dataEntity = entity[i];
                for (let key in dataEntity) {
                    let check = objEntity.includes(key);
                    if (check) {
                        let value = dataEntity[key];
                        dataEntity[key] = ObjectId(value);
                    }
                }
            }

        } else {
            for (let key in entity) {
                let check = objEntity.includes(key);
                if (check) {
                    let value = entity[key];
                    entity[key] = ObjectId(value);
                }
            }
        }
    }


    /**
     * Generate Code For a Code
     */
    this.autoGenerateCode = function () {

    }


    /**
     * set timestamp
     */
    this.setTimeStamp = function (entity, req) {
        var now = new Date()
        var date = now.toLocaleDateString();
        if (req.method === 'POST') {
            entity.createDate = date;
            entity.updateDate = date;
        } else if (req.method === 'PUT') {
            entity.updateDate = date;
        }
    }

    /**
     * set is_delete for all collection after Post or Delete
     */

    this.isDelete = function (entity, req) {
        if (req.method === 'POST') {
            entity.is_delete = 0;
        }
    }

}

module.exports = new BaseFunction();