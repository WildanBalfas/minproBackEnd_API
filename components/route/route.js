'use strict';

module.exports = exports = function (server) {
    require('../controllers/template.controller')(server, 'm_menu');
    require('../controllers/template.controller')(server, 'm_unit');
    require('../controllers/template.controller')(server, 'm_menu_access');
    require('../controllers/template.controller')(server, 'm_company');
    require('../controllers/template.controller')(server, 'm_souvenir');
}