const express = require('express');
const router = express.Router();
const server_connection = require('../controllers/server_controller')

router.get('/',server_connection.login);
router.post('/',server_connection.login_complete)

router.get('/signup',server_connection.signup)
router.post('/signup',server_connection.signup_complete)



module.exports = router;