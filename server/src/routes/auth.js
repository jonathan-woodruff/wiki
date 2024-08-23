const { Router } = require('express');
const router = Router();
const { protected, register, login, logout } = require('../controllers/auth');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { registerValidation, loginValidation } = require('../validators/auth');
const { userAuth } = require('../middlewares/auth-middleware');

router.get('/protected', userAuth, protected);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', logout);

module.exports = router;
