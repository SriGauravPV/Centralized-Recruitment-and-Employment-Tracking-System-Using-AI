const router = require('express').Router();
const { register } = require('../controllers/studentController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', register);

module.exports = router;