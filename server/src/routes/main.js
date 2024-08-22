const { Router } = require('express');
const router = Router();
const { postWiki, getWiki } = require('../controllers/main');

router.post('/postWiki', postWiki);
router.get('/getWiki', getWiki);

module.exports = router;