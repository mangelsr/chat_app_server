const { response } = require('express');

const Message = require('../models/message');

const getMessages = async (req, res = response) => {
    try {
        const myUid = req.uid;
        const otherUid = req.params.other;

        const from = Number(req.query.from)  || 0;

        const messages = await Message
            .find({$or: [
                { from: myUid, to: otherUid },
                { from: otherUid, to: myUid }
            ]})
            .sort({ createdAt: 'desc' })
            .limit(30);
        
        return res.json({
            ok: true,
            messages,
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
    getMessages,
}