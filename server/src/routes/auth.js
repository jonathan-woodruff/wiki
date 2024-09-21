const { Router } = require('express');
const router = Router();
const { register, login, logout } = require('../controllers/auth');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { registerValidation, loginValidation } = require('../validators/auth');
const { userAuth } = require('../middlewares/auth-middleware');
const { userAuthNext } = require('../middlewares/is-auth-middleware');

router.get('/checkForCookie', userAuth);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', logout);

module.exports = router;
 