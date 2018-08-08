'use strict';

module.exports = function(entity,req){
    var now = new Date()
    var date = now.toLocaleDateString();
    if (req.method === 'POST') {
        entity.createDate = date;
        entity.updateDate = date;
    }else if (req.method === 'PUT'){
        entity.updateDate = date;
    }
}