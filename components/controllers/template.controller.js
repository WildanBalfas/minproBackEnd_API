'use strict';
let dataModel = require('../models/template.model');
let Base = require('../base/base.function');

module.exports = exports = function (server, name) {  
    const route = '/api/' + Base.regexURL(name);
    server.post(route, (req, res, next) => {
        dataModel.model(req, res, next, name);
    });

    server.get(route, (req, res, next) => {
        dataModel.model(req, res, next, name);
    });

    server.get(route + '/:id', (req, res, next) => {
        dataModel.model(req, res, next, name);
    });

    server.put(route + '/:id', (req, res, next) => {
        dataModel.model(req, res, next, name);
    });


    server.del(route + '/:id', (req, res, next) => {
        dataModel.model(req, res, next, name);
    });
}

