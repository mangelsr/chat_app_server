/**
 * path: 'api/auth'
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const { fieldValidation } = require('../middlewares/field-validation');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/register', [
    check('name', 'Name field is required').notEmpty(),
    check('email', 'Email field is required').isEmail(),
    check('password', 'Password field is required').notEmpty(),
    fieldValidation,
], createUser);

router.post('/login', [
    check('email', 'Email field is required').isEmail(),
    check('password', 'Password field is required').notEmpty(),
    fieldValidation,
], login);

router.post('/renew', [validateJWT], renewToken);

module.exports = router;