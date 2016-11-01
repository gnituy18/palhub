var redis = require('redis')
var promise = require('bluebird')
promise.promisifyAll(redis)
var client = redis.createClient()
client.del('users')

module.exports = client
