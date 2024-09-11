const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' })
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../uploads");
    },
    filename: function (req, file, cb) {
        console.log(req.file);
        cb(null, Date.now() + "-" + file.fieldname + ".png");
    },
});
const upload = multer({ storage: storage });*/
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
    postAvatar
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
router.post('/postAvatar', userAuth, upload.single('avatar'), postAvatar);

module.exports = router;