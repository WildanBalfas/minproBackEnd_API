'use strict';

const MongoClient = require('mongodb').MongoClient;
const templateCtrl = require('./template.controller');

module.exports = exports = function (server) {
    let name = 'upload';
    let dbo;
    templateCtrl(server, name);
}