const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const User = require('../models/user');

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const emailExist = await User.findOne({email});
        if (emailExist) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exist',
            });
        }
        const user = new User(req.body);
        
        // Password hashing
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        
        await user.save();

        // Generate JWT
        const token = await generateJWT(user.uid);
        
        return res.json({
            ok: true,
            user
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Contact admin!',
        });
    }
};

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Email not found',
            });
        }

        // Password check
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password',
            });
        }

        // Generate JWT
        const token = await generateJWT(user.uid);
            
        return res.json({
            ok: true,
            exisingUser: user,
            token,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Contact admin!',
        });
    }
};

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Uid not found',
            });
        }

        // Generate JWT
        const token = await generateJWT(uid);

        return res.json({
            ok: true,
            user,
            token
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Contact admin!',
        });
    }
};

module.exports = {
    createUser,
    login,
    renewToken,
}