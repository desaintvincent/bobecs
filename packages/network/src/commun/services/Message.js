const msg = class Message {
    static declare(string) {
        msg._types.push(string);
    }

    static encode(type, json) {
        return msg._encode(type, json);
    }

    static decode(message) {
        return msg._decode(message);
    }

    static join(buffers, delimiter = ';') {
        return msg._join(buffers, delimiter);
    }

    static split(buf, delimiter = ';', includeDelim = false, callback = null) {
        return msg._split(buf, delimiter, includeDelim, callback);
    }

    static size(message) {
        return message.byteLength;
    }
};

msg._encode = (type, json) => {
    const id = msg._types.indexOf(type);
    if (id >= 0) {
        const buffID = Buffer.alloc(4);
        buffID.writeUInt32BE(id, 0);
        return Buffer.concat([buffID, Buffer.from(JSON.stringify(json))]);
    }
};

msg._decode = (message) => {
    const typeID = message.slice(0, 4).readUInt32BE(0);
    return {
        type: msg._types[typeID],
        data: JSON.parse(message.slice(4, message.byteLength).toString())
    };
};

msg._join = (buffers, delimiter) => {
    let d = Buffer.from(delimiter);

    return buffers.reduce((prev, b) => Buffer.concat([prev, d, b]));
};

msg._split = (buf, delimiter = ';', includeDelim = false, callback = null) => {
    const d = Buffer.from(delimiter);
    var move = includeDelim ? d.length : 0;
    const lines = [];
    let search = -1;

    while ((search = buf.indexOf(d)) > -1) {
        if (callback) {
            callback(buf.slice(0, search + move));
        } else {
            lines.push(buf.slice(0, search + move));
        }
        buf = buf.slice(search + d.length, buf.length);
    }

    if (callback) {
        callback(buf);
    } else {
        lines.push(buf);
        return lines;
    }
};

msg._types = ['default', 'ecs'];

module.exports = msg;
