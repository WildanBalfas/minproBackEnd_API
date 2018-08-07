'use strict';

const ObjectId = require('mongodb').ObjectId;

module.exports = function(entity){
  if (entity.m_menu_id) {
    entity.m_menu_id = ObjectId(entity.m_menu_id);
}
if (entity.m_company_id) {
  entity.m_company_id = ObjectId(entity.m_company_id);
}
if (entity.parent_id) {
  entity.parent_id = ObjectId(entity.parent_id);
}
if (entity.m_role_id) {
  entity.m_role_id = ObjectId(entity.m_role_id);
}
if (entity.m_employee_id) {
  entity.m_employee_id = ObjectId(entity.m_employee_id);
}
if (entity.m_unit_id) {
  entity.m_unit_id = ObjectId(entity.m_unit_id);
}
}