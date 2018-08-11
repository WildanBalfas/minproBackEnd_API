'use strict';
function BaseCode() {
    this.getTableCode = function (tableName) {
        let Base = require('./base.function');
        let ddmmyy = Base.setTanggal('ddmmyy')
        if (tableName == 't_trial') {
            return 'TR0000';
        } else if (tableName == 'm_company') {
            return 'CP0000';
        } else if (tableName == 'm_role') {
            return 'RO0000';
        } else if (tableName == 'm_menu') {
            return 'ME0000';
        } else if (tableName == 'm_unit') {
            return 'UN0000';
        } else if (tableName == 'm_souvenir') {
            return 'SV0000';
        } else if (tableName == 'm_product') {
            return 'PR0000';
        } else if (tableName == 't_event') {
            return 'TRWOEV'+ddmmyy+'00000';
        } else if (tableName == 't_design') {
            return 'TRWODS' + ddmmyy + '00000';
        } else if (tableName == 't_promotion') {
            return 'TRWOMP' + ddmmyy + '00000';
        } else if (tableName == 't_souvenir') {
            return 'TRSV' + ddmmyy + '00000';
        }
    }
}

module.exports = new BaseCode();