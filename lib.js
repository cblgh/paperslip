var crypto = require('crypto')
var Readable = require("stream").Readable
var hyperswarm = require("@hyperswarm/network")

exports.read = function (topic, cb) {
    var net = hyperswarm()
    // look for peers listed under this topic
    const topicBuffer = crypto.createHash('sha256')
        .update(topic)
        .digest()

    net.join(topicBuffer, {
        lookup: true, // find & connect to peers
    })

    net.on('connection', (socket, details) => {
        socket.pipe(process.stdout)
        // we have received everything
        socket.on("end", cb)
    })
}

exports.write = function (topic, data) {
    var net = hyperswarm()
    // look for peers listed under this topic
    const topicBuffer = crypto.createHash('sha256')
        .update(topic)
        .digest()

    net.join(topicBuffer, {
        lookup: true, // find & connect to peers
        announce: true // optional- announce self as a connection target
    })

    net.on('connection', (socket, details) => {
        var stream = process.stdin
        if (data) {
            stream = new Readable
            stream.push(data)
            stream.push(null)
        }
        stream.pipe(socket)
        stream.on("end", function () {
            socket.end()
        })
    })
}
