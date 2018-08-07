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

    /**
     * Cek, apakah Array Lebih Dari Satu Atau Tidak.
     * Object Array atau Tidak
     */
    if(entity.length > 0){
        for(let i=0; i< entity.length; i++){
            let dataEntity = entity[i];
            for (let key in dataEntity) {
                let check = objEntity.includes(key);
                if (check) {
                    let value = dataEntity[key];
                    dataEntity[key] = ObjectId(value);
                }
            }
        }
        
    }else{
        for (let key in entity) {
            let check = objEntity.includes(key);
            if (check) {
                let value = entity[key];
                entity[key] = ObjectId(value);
            }
        }
    }
}