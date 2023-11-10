const express = require('express');
const { userLogin, userRegister, getUser } = require("../controllers/userController");
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();






router.post('/register', userRegister);


router.post('/login', userLogin);



router.get('/current', validateToken, getUser);


module.exports = router;