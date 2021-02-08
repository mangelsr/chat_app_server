const { io } = require('../index');
const { testJWT } = require('../helpers/jwt');
const { userConnected, userDisconnected, saveMessage } = require('../controllers/socket');


io.on('connection', client =>  {
    // Client verification
    const [validToken, uid] = testJWT(client.handshake.headers['x-token']);
    if (!validToken) return client.disconnect();

    // Client is authenticated
    userConnected(uid);

    // Register client to it's own room/channel
    client.join(uid);

    client.on('message', async (payload) => {
        await saveMessage(payload);
        io.to(payload.to).emit('message', payload);
    });

    client.on('disconnect', () => {
        userDisconnected(uid);
    });
});