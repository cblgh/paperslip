const hcrypto = require('hypercore-crypto')
const crypto = require("crypto")
const Readable = require('stream').Readable
const duplexify = require('duplexify')
const hyperswarm = require('hyperswarm')

function initiate (topic, opts) {
  const net = hyperswarm()
  // look for peers listed under this topic
  // hash topic in a way which makes observing the DHT to derive the actual topic implausible
  const topicHash = hash(topic) 
  net.join(topicHash, opts)
  return net
}

function hash (topic) {
    const hash = crypto.createHash('sha256')
        .update(topic)
        .digest()
    return hcrypto.discoveryKey(hash)
}


exports.read = function (topic, cb) {
  if (!cb) cb = function () {}
  const stream = duplexify()
  const net = initiate(topic, {
    lookup: true // find & connect to peers
  })

  net.on('connection', (socket, details) => {
    stream.setReadable(socket)
    // we have received everything
    socket.on('end', function () {
      net.leave(hash(topic))
      cb()
    })
    socket.on('error', err => { stream.destroy(err) })
    net.on('error', err => { stream.destroy(err) })
  })
  return stream
}

exports.write = function (topic, data, log) {
  if (!log) log = function () {}
  const net = initiate(topic, {
    lookup: true, // find & connect to peers
    announce: true // optional- announce self as a connection target
  })

  net.on('connection', (socket, details) => {
    log(`${Object.values(socket.address()).join(':')} connected\n`)
    let stream = data
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
