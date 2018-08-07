'use strict';

module.exports = {
    port: process.env.PORT || 8000,
    dbconn: process.env.PORT ? 'mongodb://admin:admin123@ds213472.mlab.com:13472/minprodb' : 'mongodb://localhost:27017/minprodb',
    dbname: 'minprodb'
}