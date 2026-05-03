const User = require('../models/User');

const getEmployees = async (req, res) => {
  try {
    const filter = { role: 'employee' };
    if (req.query.department) filter.department = req.query.department;
    const employees = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load employees' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, department, jobTitle, jobDescription, joinedAt, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hash = await require('bcryptjs').hash(password || 'Password123!', 10);
    const employee = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role: 'employee',
      department: department || 'General',
      jobTitle: jobTitle || 'Employee',
      jobDescription: jobDescription || '',
      joinedAt: joinedAt ? new Date(joinedAt) : Date.now(),
      phone,
      status: 'active'
    });
    const employeeData = employee.toObject();
    delete employeeData.password;
    res.json(employeeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Create employee failed' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const updates = req.body;
    if (updates.password) {
      updates.password = await require('bcryptjs').hash(updates.password, 10);
    }
    Object.assign(employee, updates);
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };
