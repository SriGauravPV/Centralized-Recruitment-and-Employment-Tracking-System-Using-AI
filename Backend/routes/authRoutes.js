const router = require('express').Router();
const { login } = require('../controllers/authController');

router.post('/login/:type', login);

module.exports = router;