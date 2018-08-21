'use strict';

module.exports = exports = function (server) {
    // require('../controllers/template.controller')(server, 'm_menu');
    require('../controllers/template.controller')(server, 'm_role');
    // require('../controllers/template.controller')(server, 'm_unit');
    // require('../controllers/template.controller')(server, 'm_menu_access');
    // require('../controllers/template.controller')(server, 'm_company');
    // require('../controllers/template.controller')(server, 'm_souvenir');
    // require('../controllers/template.controller')(server, 'm_product');
    require('../controllers/m_user.controller')(server);
    require('../controllers/m_employee.controller')(server);
    // require('../controllers/template.controller')(server, 't_souvenir');
    // require('../controllers/template.controller')(server, 't_event');
    // require('../controllers/template.controller')(server, 't_souvenir');
    require('../controllers/t_souvenir')(server);
    require('../controllers/m_souvenir_unit')(server);
    // require('../controllers/m_products')(server);
    require('../controllers/m_menuaccess.controller')(server);
    require('../controllers/t_event.controller')(server);


    require('../controllers/t_design.controller')(server);
    require('../controllers/m_menu.controller')(server);
    require('../controllers/t_promotion.controller')(server);
    require('../controllers/template.controller')(server, 't_design_item');
    
    require('../controllers/template.controller')(server, 't_design_item_file');

    require('../controllers/template.controller')(server, 't_trial');

    require('../controllers/template.controller')(server, 'service');

    require('../controllers/uploads')(server);

    require('../controllers/m_employee_role')(server);

    require('../controllers/m_company.controller')(server);
    require('../controllers/m_unit.controller')(server);
    require('../controllers/m_product.controller')(server);


}