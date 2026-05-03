const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.use(authMiddleware);
router.get('/', permit('admin'), getEmployees);
router.post('/', permit('admin'), createEmployee);
router.put('/:id', permit('admin'), updateEmployee);
router.delete('/:id', permit('admin'), deleteEmployee);

module.exports = router;
