const registerSchema = {
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  password: 'string'
};

const leaveSchema = {
  type: 'string',
  startDate: 'string',
  endDate: 'string',
  reason: 'string'
};

const attendanceSchema = {
  date: 'string',
  checkIn: 'string',
  checkOut: 'string'
};

module.exports = { registerSchema, leaveSchema, attendanceSchema };
