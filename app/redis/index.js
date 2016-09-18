var redis = require('redis')
var promise = require('bluebird')
promise.promisifyAll(redis)

module.exports = redis.createClient()
