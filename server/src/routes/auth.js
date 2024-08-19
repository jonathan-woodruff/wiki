const { Router } = require('express');
const router = Router();
const { addDumbUser } = require('../controllers/auth');

router.post('/addDummy', addDumbUser);

module.exports = router;
