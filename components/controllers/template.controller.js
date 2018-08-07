'use strict';
let dataModel = require('../models/template.model');

module.exports = exports = function (server, name) {  
    const route = '/api/' + name;
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

