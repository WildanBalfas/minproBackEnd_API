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
     * 
     */
    this.autoGenerateCode = function () {
        let dataModel = require('../models/template.model');
        dataModel.lastIndex(function (callback) {
            let code = callback[0].code; // Dapatkan code
            let slice = code.slice(2); // Potong Huruf Yang Di Depan
            let strLength = code.length; // Panjang String
            let jumlah = parseInt(slice) + 1; // Melakukan penjumlahan
            let jumlahLength = (jumlah.toString()).length;
            let codeDepan = code.slice(0, 2)
            let codeTengah = code.slice(2, strLength - (parseInt(jumlahLength)));
            console.log(codeDepan + codeTengah + jumlah)
        })


    }


    /**
     * set timeStamp for all collection
     * @param {*} entity 
     * @param {*} req 
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
     * set is_delete for all collection after Post
     * 
     * @param {*} entity 
     * @param {*} req 
     */
    this.isDelete = function (entity, req) {
        if (req.method === 'POST') {
            entity.is_delete = 0;
        }
    }


    /**
     * Dapatkan nama collection dan ubah '_' menjadi '-'
     * @param {*} name 
     */
    this.regexURL = function (name) {
        return name.replace(/_/g, "-")
    }
}

module.exports = new BaseFunction();