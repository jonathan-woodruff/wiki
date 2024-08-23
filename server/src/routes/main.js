const { Router } = require('express');
const router = Router();
const { postWiki, getWiki } = require('../controllers/main');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { userAuth } = require('../middlewares/auth-middleware');

router.post('/postWiki', postWiki);
router.get('/getWiki', getWiki);

module.exports = router;