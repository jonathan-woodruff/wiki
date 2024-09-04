const { Router } = require('express');
const router = Router();
const { 
    postWiki, 
    getWikis, 
    getProfileData, 
    updateProfile, 
    getCreateWikiData, 
    getWikiByID,
    publishWikiEdits
} = require('../controllers/main');
const { userAuth } = require('../middlewares/auth-middleware');

router.post('/postWiki', userAuth, postWiki);
router.get('/getWikis', getWikis);
router.get('/getProfileData', userAuth, getProfileData);
router.put('/updateProfile', userAuth, updateProfile);
router.get('/getCreateWikiData', userAuth, getCreateWikiData);
router.get('/getWikiByID', getWikiByID);
router.put('/putWiki', userAuth, publishWikiEdits);

module.exports = router;