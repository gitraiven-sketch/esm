const { ROLES } = require('../constants/roles');

const permissions = {
  admin: [
    'manage_employees',
    'approve_leave',
    'view_reports',
    'manage_contracts',
    'manage_announcements',
    'view_attendance'
  ],
  employee: [
    'check_in_out',
    'request_leave',
    'view_announcements',
    'view_contracts',
    'chat'
  ]
};

const can = (role, permission) => permissions[role]?.includes(permission);
module.exports = { permissions, can, ROLES };
