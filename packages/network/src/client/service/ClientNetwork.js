const Message = require('../../commun/services/Message');
const clientnetwork = class ClientNetwork {
    static connect(host = 'ws://localhost:8080') {
        return new Promise((done, reject) => {
            ClientNetwork._socket = new WebSocket(host);
            ClientNetwork._socket.binaryType = 'arraybuffer';

            ClientNetwork._socket.onopen = (e) => {
                done(e);
            };

            ClientNetwork._socket.onerror = (e) => {
                reject(e);
            };
        });
    }

    static onMessage(callback) {
        ClientNetwork._socket.onmessage = (data) => {
            Message.split(Buffer.from(data.data), ';', false, (buf) => {
                ClientNetwork._currentDownSize += Message.size(buf);
                const { type, data } = Message.decode(buf);
                if (type === 'ecs') {
                    ClientNetwork._queue.push(data);
                } else {
                    callback(type, data);
                }
            });
        };
    }

    static send(type, data) {
        ClientNetwork._socket.send(Message.encode(type, data));
    }
};

clientnetwork._socket = null;
clientnetwork._queue = [];
clientnetwork._currentDownSize = 0;
clientnetwork._totalDownSize = 0;
clientnetwork._downSpeed = 0;
clientnetwork._timer = 0;

module.exports = clientnetwork;
