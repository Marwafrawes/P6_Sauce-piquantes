const express = require('express');
const router = express.Router(); 

const { model } = require('mongoose');
//creation de chemin user dans controllors
const userCtrl = require('../controllors/user');

router.post('/api/auth/signup', userCtrl.signup); 
router.post('/api/auth/login', userCtrl.login);

module.exports = router; 