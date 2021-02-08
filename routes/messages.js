/**
 * path: 'api/messages'
 */
const { Router } = require('express');

const { getMessages } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:other', [validateJWT], getMessages);

module.exports = router;