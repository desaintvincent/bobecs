const WebSocket = require('ws');
const Message = require('../../commun/services/Message');

const servernetwork = class ServerNetwork {
    static start(port = 8080) {
        servernetwork._socket = new WebSocket.Server({ port });
        servernetwork._socket.binaryType = 'arraybuffer';
    }

    static onConnection(callback) {
        servernetwork._socket.on('connection', (ws) => {
            const id = new Date().getTime();
            ws.isNew = true;
            ServerNetwork._clients.set(id, ws);
            ws.on('error', () => {
                ServerNetwork._clients.delete(id);
            });

            callback(id);
        });
    }

    static listen(id, callback = (type, data) => {}) {
        servernetwork._clients.get(id).on('message', (data) => {
            Message.split(Buffer.from(data), ';', false, (buf) => {
                const { type, data } = Message.decode(buf);
                callback(type, data);
            });
        });
    }

    static onClose(id, callback = (code) => {}) {
        servernetwork._clients.get(id).on('close', (reasonCode, description) => {
            callback(reasonCode, description);
            servernetwork._clients.delete(id);
        });
    }

    static sendDataToID(id, data) {
        try {
            servernetwork._clients.get(id).send(data);
        } catch (e) {
            servernetwork._clients.delete(id);
        }
    }

    static send(id, type, data) {
        servernetwork.sendDataToID(id, Message.encode(type, data));
    }

    static sendAll(type, data) {
        servernetwork._clients.forEach((ws, id) => this.send(id, type, data));
    }

    static sendQueue(id, type, data) {
        const message = Message.encode(type, data);
        const buff = servernetwork._buffers.get(id);
        if (!buff && Message.size(message) > servernetwork._bufferSize) {
            servernetwork.sendDataToID(id, message);
        } else if (!buff) {
            servernetwork._buffers.set(id, message);
        } else if (Message.size(buff) + Message.size(message) < ServerNetwork._bufferSize) {
            servernetwork._buffers.set(id, Message.join([buff, message]));
        } else {
            servernetwork.sendDataToID(id, buff);
            servernetwork._buffers.set(id, message);
        }
    }

    static sendAllQueue(type, data) {
        servernetwork._clients.forEach((ws, id) => this.sendQueue(id, type, data));
    }

    static emptyQueue(id) {
        const buff = servernetwork._buffers.get(id);
        if (buff) {
            servernetwork.sendDataToID(id, buff);
            servernetwork._buffers.delete(id);
        }
    }

    static isNew(id) {
        return servernetwork._clients.get(id).isNew;
    }

    static setNew(id, isNew = true) {
        servernetwork._clients.get(id).isNew = isNew;
    }

    static getClients() {
        return servernetwork._clients;
    }
};

servernetwork._socket = null;
servernetwork._clients = new Map();
servernetwork._buffers = new Map();
servernetwork._bufferSize = 1500;

module.exports = servernetwork;