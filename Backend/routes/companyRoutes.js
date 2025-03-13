const router = require('express').Router();
const { register } = require('../controllers/companyController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', register);

module.exports = router;