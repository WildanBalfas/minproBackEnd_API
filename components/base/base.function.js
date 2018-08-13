'use strict';
const ObjectId = require('mongodb').ObjectID;
const TableCode = require('./base.tablecode');
const MongoClient = require('mongodb').MongoClient;
let dbo;
let fs = require('fs-extra'); // for uploads
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
            'm_unit_id',
            'received_by',
            "request_by",
            "approved_by",
            "assign_to",
            "t_event_id",
            "t_design_id",
            "m_product_id",
            "t_design_item_id",
            "t_promotion_id",
            "settlement_by",
            "settlement_approved_by",
            "t_souvenir_id",
            "m_souvenir_id"
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
     * set is_delete for all collection after POST
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


    this.generateCode = function (entity, name, response) {
        let code;
        let result;
        let arrayName = ['t_event', 't_design', 't_promotion', 't_souvenir'];

        if (response.length != 0) { // Ada di database
            code = response[0].code; // Dapatkan code
        } else {
            code = TableCode.getTableCode(name); // Tidak Ada Di Database
        }

        if (arrayName.includes(name)) {
            // Exmple Code: TRWOEV11081800001
            let codeDepan = code.slice(0, code.length - 11); // Code: TRWOEV
            let codeTengah = this.setTanggal('ddmmyy'); // Tanggal Sekarang : 110818
            let codeBelakang = code.slice(-5); // 00001
            let jumlahCodeBelakang = parseInt(codeBelakang) + 1; // codeBelakang + 1 = 00001 + 1 = 2
            let panjangHasilJumlah = (jumlahCodeBelakang.toString()).length; // panjangCodeBelakang(2) = 1
            let panjangCode = code.length; // Panjang Code: TRWOEV11081800001 = 17
            let panjangCodeBelakang = code.slice(-5, panjangCode - panjangHasilJumlah); // 0000
            result = codeDepan + codeTengah + panjangCodeBelakang + jumlahCodeBelakang;
        } else {
            let slice = code.slice(2); // slice: PR0001 = 0001
            let strLength = code.length; // Panjang Code PR0001 = 6
            let jumlah = parseInt(slice) + 1; // slice + 1 = 0001 + 1 = 2
            let jumlahLength = (jumlah.toString()).length; // Panjang jumlah(2) = 1
            let codeDepan = code.slice(0, 2); // dapat kode depan: PR0001 = PR
            let codeTengah = code.slice(2, strLength - (parseInt(jumlahLength))); // Kode Tengah: PR0001 = 000 => Yang '0' Diambil
            result = codeDepan + codeTengah + jumlah; // Dapatkan generate Code dari hasil penggabungan
        }
        entity.code = result;
    }


    /**
     * Set Tanggal
     * @param {*} format 
     */
    this.setTanggal = function (format) {
        var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var yy = (today.getFullYear() + "").slice(2);
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        if (format == 'dd-mm-yyyy') {
            today = dd + '-' + mm + '-' + yyyy; // 10-12-2018
        } else if (format == 'dd/mm/yyyy') {
            today = dd + '/' + mm + '/' + yyyy; // 10/12/2018
        }else if (format == 'yy/mm') {
            today = yyyy + '/' + mm + '/' + dd; // 2018/12/10
        } else if (format == 'dd mm yyyy') {
            today = dd + ' ' + mm + ' ' + yyyy; // 10 12 2018
        } else if (format == 'dd/mm/yy') {
            today = dd + '/' + mm + '/' + yyyy; // 10/12/18
        } else if (format == 'ddmmyyyy') {
            today = dd + mm + yyyy; // 10122018
        } else if ('ddmmyy') {
            today = dd + mm + yy; // 101218
        }

        return today;
    }

    this.uploadFiles = function (req, res, next, entity) {
        let tanggal = this.setTanggal('yy/mm')
        var crypto = require("crypto");
        var id = crypto.randomBytes(20).toString('hex');
        let dataFile = req.files.file;
        var filePath = dataFile.path;
        var currentFolder = process.cwd() + '/pub/uploads'  + '/' + tanggal;
        var fileType = dataFile.type;
        var fileSize = dataFile.size;
        var fileName = dataFile.name;
        var fileExtension = fileName.slice(fileName.indexOf("."));
        var randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var filename = randomString + fileExtension;
        fs.move(filePath, currentFolder + '/' + filename, function (err) {
            if (err) return err;
        });
        entity.filename = fileName;
        entity.size = fileSize;
        entity.extention = fileExtension;
        res.end('upload');
        next();
    }
}

module.exports = new BaseFunction();