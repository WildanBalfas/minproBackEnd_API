'use strict';

module.exports = function(entity,req){
    if (req.method === 'POST') {
        entity.createDate = new Date();
        entity.updateDate = new Date();
    }else if (req.method === 'PUT'){
        entity.updateDate = new Date();
    }
}