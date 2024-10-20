const { Router } = require('express');
const router = Router();
const { 
    postWiki, 
    getWikis, 
    getProfileData, 
    updateProfile, 
    getCreateWikiData, 
    getWikiByID,
    publishWikiEdits,
    getHistory,
    getViewProfileData,
    getHistoricalWikiData,
    postCommunity,
    createPaymentIntent,
    sendEmail
} = require('../controllers/main');
const { userAuth } = require('../middlewares/auth-middleware');

router.post('/postWiki', userAuth, postWiki);
router.get('/getWikis', getWikis);
router.get('/getProfileData', userAuth, getProfileData);
router.put('/updateProfile', userAuth, updateProfile);
router.get('/getCreateWikiData', userAuth, getCreateWikiData);
router.get('/getWikiByID', getWikiByID);
router.put('/putWiki', userAuth, publishWikiEdits);
router.get('/viewHistory', getHistory);
router.get('/viewProfile', getViewProfileData);
router.get('/viewHistoricalWiki', getHistoricalWikiData);
router.post('/postCommunity', userAuth, postCommunity);
router.post('/createPaymentIntent', createPaymentIntent);
router.post('/sendEmail', sendEmail);

module.exports = router;