const { Router } = require('express');
const router = Router();
const { postWiki, /*getWiki,*/ getWikis, getProfileData, updateProfile, getCreateWikiData, getWikiByID } = require('../controllers/main');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { userAuth } = require('../middlewares/auth-middleware');

router.post('/postWiki', userAuth, postWiki);
//router.get('/getWiki', getWiki);
router.get('/getWikis', getWikis);
router.get('/getProfileData', userAuth, getProfileData);
router.put('/updateProfile', userAuth, updateProfile);
router.get('/getCreateWikiData', userAuth, getCreateWikiData);
router.get('/getWikiByID', getWikiByID);

module.exports = router;