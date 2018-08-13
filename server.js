'use strict';
const restify = require('restify');


// const jwt = require('jsonwebtoken');
const corsMiddleWare = require('restify-cors-middleware');

/*
/ Menentukan Nama Server Dan Versi Server
*/
const server = restify.createServer({
    name: 'X Mini Project',
    version: '1.0.0'
});

server.use(restify.plugins.bodyParser());

const cors = corsMiddleWare({
    origins: ['*'],
    allowHeaders: ['X-App-Version'],
    exposeHeaders: []
});

server.pre(cors.preflight);
server.use(cors.actual);

/**
 * Route in route components
 */

require('./components/route/route')(server);

server.get('/', (req, res, next) => {
    let date = new Date();
    var html = "<html><head><title>Some Project</title></head><body><h1>Selamat Datang " + date + "</h1></body></html>";

    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(html),
        'Content-Type': 'text/html',
    });

    res.write(html);
    res.end;
});

global.config = require('./components/configurations/config');

server.listen(config.port, function () {
    console.log('%s listen di %s', server.name, server.url);
});