const { Router } = require('express');
const router = Router();
const { 
    protected, 
    register, 
    login, 
    logout, 
    changePassword, 
    updateUserName, 
    updateUserEmail,
    sendPasswordResetEmail,
    checkResetURL,
    resetPassword
} = require('../controllers/auth');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { 
    registerValidation, 
    loginValidation, 
    changePasswordValidation, 
    changeEmailValidation,
    resetEmailValidation,
    resetPasswordValidation
} = require('../validators/auth');
const { userAuth } = require('../middlewares/auth-middleware');
const { userAuthNext } = require('../middlewares/is-auth-middleware');

router.get('/checkForCookie', userAuth, protected);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', logout);
router.put('/changePassword', userAuth, changePasswordValidation, validationMiddleware, changePassword);
router.put('/updateUserName', userAuth, updateUserName);
router.put('/updateUserEmail', userAuth, changeEmailValidation, validationMiddleware, updateUserEmail);
router.post('/sendPasswordResetEmail', resetEmailValidation, validationMiddleware, sendPasswordResetEmail);
router.get('/checkResetURL', checkResetURL);
router.post('/resetPassword', resetPasswordValidation, validationMiddleware, resetPassword);

module.exports = router;
 