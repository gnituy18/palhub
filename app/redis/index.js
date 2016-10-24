var redis = require('redis')
var promise = require('bluebird')
promise.promisifyAll(redis)
var client = redis.createClient()
client.set('counter', '0')

module.exports = client
