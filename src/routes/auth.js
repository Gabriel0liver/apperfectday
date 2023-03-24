const express = require('express')
const router = express.Router()

const { register, loginRequired, login, logout } = require('../controllers/auth')

router.post('/register', register);
router.post('/login', login);
router.post('/logout',loginRequired, logout)


router.get('/',(req, res) => {
 res.render('calendar/login',{message:''});
});

module.exports = router
