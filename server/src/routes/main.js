const { Router } = require('express');
const router = Router();
const { postWiki } = require('../controllers/main');

router.post('/postWiki', postWiki);

module.exports = router;