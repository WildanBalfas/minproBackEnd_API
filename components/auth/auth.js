'use strict';
const jwt = require('jsonwebtoken');

module.exports = exports = function authorization(server) {

    server.post('/apo/posts', verifytoken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.send('Forbidden Post');
            } else {
                res.json({
                    message: 'Posting Telah Dibuat',
                    authData,
                    token: req.token,
                });
            }
        })
    });


    server.post('/apo/login', (req, res) => {
        const user = {
            id: 1,
            username: 'brad',
            email: 'brad@gmail.com',
        }

        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.json({
                token
            });
        });
    });

    /**
     * Format Of Token 
     * Authorization: Bearer <access-token>
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    function verifytoken(req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // set the token
            req.token = bearerToken;
            // next middleware
            next();
        } else {
            res.send(403, 'Forbidden')
        }
    }
}