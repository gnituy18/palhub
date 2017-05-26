const redis = require('redis')
const promise = require('bluebird')
promise.promisifyAll(redis)

const client = redis.createClient()
client.flushdb()

module.exports = client
