var crypto = require('crypto')
var Readable = require('stream').Readable
var duplexify = require('duplexify')
var hyperswarm = require('@hyperswarm/network')

function initiate (topic, opts) {
  var net = hyperswarm()
  // look for peers listed under this topic
  var topicBuffer = crypto.createHash('sha256')
    .update(topic)
    .digest()
  net.join(topicBuffer, opts)
  return net
}

exports.read = function (topic, cb) {
  var stream = duplexify()
  var net = initiate(topic, {
    lookup: true // find & connect to peers
  })

  net.on('connection', (socket, details) => {
    stream.setReadable(socket)
    // we have received everything
    socket.on('end', function () {
      net.leave(topic)
      cb()
    })
  })
  return stream
}

exports.write = function (topic, data, log) {
  if (!log) log = function () {}
  var net = initiate(topic, {
    lookup: true, // find & connect to peers
    announce: true // optional- announce self as a connection target
  })

  net.on('connection', (socket, details) => {
    log(`${Object.values(socket.address()).join(':')} connected\n`)
    var stream = data
    // we were passed a string note, encompass the data in a stream
    if (typeof data === 'string') {
      stream = new Readable()
      stream.push(data)
      stream.push(null)
    }
    stream.pipe(socket)
    // signal to the remote peer that we sent all data
    stream.on('end', function () {
      socket.end()
    })
  })
  return net
}

exports.stop = function (net) {
    net.destroy()
}
